import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../../config/database/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly gameService: GameService,
  ) {}

  async handleConnection(client: Socket) {
    // 클라이언트의 인증 정보에서 SID 가져오기
    const { sid } = client.handshake?.auth;
    if (!sid) {
      return;
    }

    // SID 타입 확인
    const sidType = await this.gameService.checkSidType(sid);
    const key = sidType.type === 'master' ? `master_sid=${sid}` : `participant_sid=${sid}`;

    // Redis에서 데이터 가져오기
    const data = JSON.parse(await this.redisService.get(key));

    if (data) {
      const { pinCode, position } = data;
      data['socketId'] = client.id;
      data['connection'] = 'ON';

      await this.redisService.set(key, JSON.stringify(data));
      client.join(pinCode); // Room에 소켓 추가

      const gameInfoJson = await this.redisService.get(`gameId=${pinCode}`);
      if (gameInfoJson) {
        const gameInfo = JSON.parse(gameInfoJson);
        const nicknameEventData = {
          participantList: gameInfo.participantList,
          myPosition: position,
        };
        client.emit('nickname', nicknameEventData);
      }
    }
  }

  // 클라이언트가 연결을 끊었을 때 처리하는 메서드
  async handleDisconnect(client: Socket) {
    //대기 중에 사람이 나갈 경우 갱신해주는 부분 추가 필요
    console.log(`Client disconnected: ${client.id}`);
    // connection 상태 변경 필요
    // 마스터 참여자 여부에 따라서 disconnection 관리 로직 다를듯
  }

  @SubscribeMessage('master entry')
  async handleMasterEntry(client: Socket, payload: any) {
    // 방장이 게임을 나가도 재접속이 가능하며, 게임은 지속된다.
    const { classId } = payload;

    const masterSid = uuidv4();
    const pinCode = uuidv4().slice(0, 6); // 메소드 분리해서 중복 확인하고 없을 때까지 반복
    const socketId = client.id;

    //
    const position = -1; /////////////// master의 경우 -1 환경변수 세팅하면 좋을듯
    const connection = 'ON';

    const masterinfo = { pinCode, socketId, position, connection };

    client.join(pinCode);

    await this.redisService.set(`master_sid=${masterSid}`, JSON.stringify(masterinfo));

    const quizData = await this.storeQuizToRedis(classId);
    const quizMaxNum = quizData.length - 1;
    const gameStatus = 'WAITING';

    // 퀴즈 개수를 저장.
    const gameInfo = { classId, gameStatus, currentOrder: 0, quizMaxNum, participantList: [] };

    // 게임 정보를 저장
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    client.emit('session', masterSid);
    client.emit('pincode', pinCode);
  }

  @SubscribeMessage('participant entry')
  async handleParticipantEntry(client: Socket, payload: any) {
    const { pinCode, nickname } = payload;
    const socketId = client.id;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    // character 0-5 랜덤값, position은 participantList의 길이
    // 만약 participant.length가 29이면 더이상 못들어오도록 막아야함 -> gameState를 업데이트?
    const character = Math.floor(Math.random() * 6);
    const position = gameInfo.participantList.length;
    const connection = 'ON'; // type 설정 해둠 as const ON/OFF

    const clientInfo = { pinCode, nickname, socketId, character, position, connection };

    client.join(pinCode);

    const participantSid = uuidv4();
    await this.redisService.set(`participant_sid=${participantSid}`, JSON.stringify(clientInfo));
    client.emit('session', participantSid);

    await this.redisService.zincrby(`gameId=${pinCode}:ranking`, 0, participantSid);

    const pariticipantInfo = { nickname, character, position, connection };
    gameInfo.participantList.push(pariticipantInfo);
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const nicknameEventData = { participantList: gameInfo.participantList, myPosition: position };
    this.server.to(pinCode).emit('nickname', nicknameEventData);
  }

  //이거 사용하는 이벤트 맞는지 확인/////////////////
  // @SubscribeMessage('nickname')
  // async handleNickname(client: Socket, payload: any) {
  //   const { pinCode } = payload;

  //   const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

  //   this.server.to(pinCode).emit('nickname', gameInfo.participantList);
  // }

  @SubscribeMessage('show quiz')
  async handleShowQuiz(client: Socket, payload: any) {
    const { pinCode } = payload;
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    const { classId, currentOrder, quizMaxNum } = gameInfo;
    // 캐싱된 퀴즈를 가져온다. 퀴즈를 생성할 경우, 만들어졌을거라 예상
    // 만일 레디스에 퀴즈가 저장되어있지않다면, 퀴즈를 다시 캐싱해오는 로직이 필요할지도.

    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));

    const currentQuizData = quizData[currentOrder];
    const currentTimeLimit = currentQuizData['timeLimit'];

    const choicesLength = currentQuizData['choices'].length;

    const choiceStatus = Object.fromEntries(
      Array.from({ length: choicesLength }, (_, i) => [i, 0]),
    );

    const gameStatus = {
      totalSubmit: 0,
      totalCorrect: 0,
      totalTime: 0,
      choiceStatus,
      submitHistory: [],
      emojiStatus: { easy: 0, hard: 0 },
    };
    await this.redisService.set(
      `gameId=${pinCode}:quizId=${currentOrder}`,
      JSON.stringify(gameStatus),
    );

    const isLast = gameInfo.currentOrder === quizMaxNum ? true : false;
    this.server.to(pinCode).emit('show quiz', { quizMaxNum, currentQuizData, isLast });

    const startTime = Date.now();
    await this.intervalTimeSender(pinCode, startTime, currentTimeLimit);
  }

  // timelimit을 파라미터로 입력 받아서 1초 간격으로 실행
  async intervalTimeSender(pinCode: string, startTime: number, timeLimit: number) {
    const intervalId = setInterval(async () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const remainingTime = (timeLimit + 2) * 1000 - elapsedTime;
      if (remainingTime <= 0) {
        const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

        gameInfo.currentOrder += 1;
        await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
        this.server.to(pinCode).emit('time end', { isEnd: true });
        clearInterval(intervalId);
        return;
      }
      this.server.to(pinCode).emit('timer tick', { currentTime, elapsedTime, remainingTime });
    }, 1000);
  }

  @SubscribeMessage('start quiz')
  async handleStartQuiz(client: Socket, payload: any) {
    const { sid, pinCode } = payload;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    client.to(pinCode).emit('start quiz', { isStarted: true });
    // 퀴즈 상태 바꾸기
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = 'IN PROGRESS';
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
  }

  private async storeQuizToRedis(classId: number) {
    const cachedQuizData = await this.redisService.get(`classId=${classId}`);

    if (cachedQuizData) {
      const quizData = JSON.parse(cachedQuizData);
      return quizData;
    }

    const quizData = await this.gameService.cachingQuizData(classId);

    await this.redisService.set(`classId=${classId}`, JSON.stringify(quizData), 'EX', 604800);

    return quizData;
  }

  @SubscribeMessage('submit answer')
  async handleSubmitAnswer(client: Socket, payload: any) {
    const { pinCode, sid, selectedAnswer, submitTime } = payload;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    const pariticipantInfo = JSON.parse(await this.redisService.get(`participant_sid=${sid}`));

    // 현재 퀴즈 데이터 가져옴
    const { classId, currentOrder, participantList } = gameInfo;
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));
    const currentQuizData = quizData[currentOrder];

    const participantLength = participantList.length;

    // 현재 퀴즈의 초이스 데이터 가져옴
    const currentChoicesData = currentQuizData['choices'];
    const { point, timeLimit } = currentQuizData;

    const gameStatus = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${currentOrder}`),
    );

    // 제출 기록 저장 [[nickname, solveTime]]
    gameStatus.submitHistory.push([pariticipantInfo.nickname, submitTime]);
    const submitHistory = gameStatus.submitHistory;

    gameStatus.totalSubmit += 1;
    const totalSubmit = gameStatus.totalSubmit;

    const isFlag = this.matchingAnswer(selectedAnswer, currentChoicesData);
    if (isFlag) {
      gameStatus.totalCorrect += 1;
    }

    const processedPoint = this.calculatePoints(isFlag, submitTime, timeLimit, point);
    await this.redisService.zincrby(`gameId=${pinCode}:ranking`, processedPoint, sid);

    const totalCorrect = gameStatus.totalCorrect;

    // totaltime
    gameStatus.totalTime += submitTime;
    const totalTime = gameStatus.totalTime;

    // choiceStatus
    for (const answer of selectedAnswer) {
      gameStatus.choiceStatus[answer] += 1;
    }
    const choiceStatus = gameStatus.choiceStatus;

    const participantNum = participantList.length;

    await this.redisService.set(
      `gameId=${pinCode}:quizId=${currentOrder}`,
      JSON.stringify(gameStatus),
    );

    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const solveRate = (totalCorrect / totalSubmit) * 100;
    const averageTime = (totalTime / totalSubmit) * 100;
    const participantRate = (totalSubmit / participantNum) * 100;

    const participantStatistics = { totalSubmit, solveRate, averageTime, participantRate };
    const masterStatistics = {
      totalSubmit,
      solveRate,
      averageTime,
      participantRate,
      choiceStatus,
      submitHistory,
      participantLength,
    };

    this.server.to(pinCode).emit('participant statistics', participantStatistics);
    this.server.to(pinCode).emit('master statistics', masterStatistics);
    return { submitOrder: totalSubmit };
  }

  @SubscribeMessage('emoji')
  async handleEmoji(client: Socket, payload: any) {
    const { pinCode, currentOrder, emoji } = payload;
    const gameStatus = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${currentOrder}`),
    );
    gameStatus.emojiStatus[emoji] += 1;
    await this.redisService.set(
      `gameId=${pinCode}:quizId=${currentOrder}`,
      JSON.stringify(gameStatus),
    );
    this.server.to(pinCode).emit('emoji', gameStatus.emojiStatus);
  }

  calculatePoints(isFlag: boolean, submitTime: number, timeLimit: number, point: number) {
    const timeLimitToMs = (timeLimit + 2) * 1000;
    if (isFlag) {
      const ratio = (timeLimitToMs - submitTime) / timeLimitToMs;
      return Math.floor(ratio * point);
    }
    return 0;
  }

  @SubscribeMessage('show ranking')
  async handleShowRanking(client: Socket, payload: any) {
    const { pinCode, sid } = payload;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    const participantLength = gameInfo.participantList.length;

    const allRankers = await this.gameService.getRank(
      `gameId=${pinCode}:ranking`,
      participantLength,
    );

    const rankerDatas = [];
    for (let i = 0; i < participantLength; i++) {
      const sid = allRankers[i][0];
      const score = allRankers[i][1];
      const { nickname } = JSON.parse(await this.redisService.get(`participant_sid=${sid}`));
      rankerDatas.push({ nickname, score });
    }

    const myRank = await this.redisService.zrevrank(`gameId=${pinCode}:ranking`, sid);
    const myScore = await this.redisService.zscore(`gameId=${pinCode}:ranking`, sid);
    const { nickname: myNickname } = JSON.parse(
      await this.redisService.get(`participant_sid=${sid}`),
    );
    const response = { rankerDatas, myRank, myScore, myNickname };
    return response;
  }

  @SubscribeMessage('end quiz')
  async handleEndQuiz(client: Socket, payload: any) {
    const { sid, pinCode } = payload;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    client.to(pinCode).emit('end quiz', { isEnded: true });
    // 퀴즈 상태 바꾸기
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = 'END';
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
  }

  matchingAnswer(selectedAnswer: Number[], currentChoicesData) {
    const correctAnswers = currentChoicesData
      .map((choice, index) => (choice.isCorrect ? index : null))
      .filter((index) => index !== null);

    const equals = (a: Number[], b: Number[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    correctAnswers.sort();
    selectedAnswer.sort();

    return equals(selectedAnswer, correctAnswers);
  }
}
