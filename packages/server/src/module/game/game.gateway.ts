import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../config/database/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './games/game.service';

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
    const data = await this.redisService.get(key);
    if (data) {
      const { pinCode } = JSON.parse(data);
      client.join(pinCode); // Room에 소켓 추가

      const gameInfoJson = await this.redisService.get(`gameId=${pinCode}`);
      if (gameInfoJson) {
        const gameInfo = JSON.parse(gameInfoJson);
        client.emit('nickname', gameInfo.participantList);
      }
    }
  }

  // 클라이언트가 연결을 끊었을 때 처리하는 메서드
  async handleDisconnect(client: Socket) {
    //대기 중에 사람이 나갈 경우 갱신해주는 부분 추가 필요
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('master entry')
  async handleMasterEntry(client: Socket, payload: any) {
    // 방장이 게임을 나가도 재접속이 가능하며, 게임은 지속된다.
    const { classId } = payload;

    // 방장의 세션 ID와 핀코드를 생성
    const masterSid = uuidv4();
    const pinCode = uuidv4().slice(0, 6); // 메소드 분리해서 중복 확인하고 없을 때까지 반복

    client.join(pinCode); // pinCode로 되어 있는 roomd을 들어감

    this.redisService.set(`master_sid=${masterSid}`, JSON.stringify({ pinCode }));

    const quizData = await this.storeQuizToRedis(classId);
    const quizMaxNum = quizData.length;

    // 퀴즈 개수를 저장.
    const gameInfo = { classId, currentOrder: 0, quizMaxNum, participantList: [] };

    // 게임 정보를 저장
    this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    client.emit('session', masterSid);
    client.emit('pincode', pinCode);
  }

  @SubscribeMessage('participant entry')
  async handleParticipantEntry(client: Socket, payload: any) {
    const { pinCode, nickname } = payload;
    const clientInfo = { pinCode, nickname };

    client.join(pinCode);

    const participantSid = uuidv4();
    this.redisService.set(`participant_sid=${participantSid}`, JSON.stringify(clientInfo));
    client.emit('session', participantSid);

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.participantList.push(nickname);
    this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    this.server.to(pinCode).emit('nickname', gameInfo.participantList);
  }

  @SubscribeMessage('nickname')
  async handleNickname(client: Socket, payload: any) {
    const { pinCode } = payload;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    this.server.to(pinCode).emit('nickname', gameInfo.participantList);
  }

  @SubscribeMessage('show quiz')
  async handleShowQuiz(client: Socket, payload: any) {
    // master 여부 판단

    const { pinCode } = payload;
    // 게임 현재 상태 가져오기
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

    gameInfo.currentOrder += 1;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const isLast = gameInfo.currentOrder === quizMaxNum ? true : false;
    this.server.to(pinCode).emit('show quiz', { currentQuizData, isLast });

    const startTime = Date.now();
    await this.intervalTimeSender(pinCode, startTime, currentTimeLimit);
  }

  // timelimit을 파라미터로 입력 받아서 1초 간격으로 실행
  async intervalTimeSender(pinCode: string, startTime: number, timeLimit: number) {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const remainingTime = (timeLimit + 2) * 1000 - elapsedTime;
      if (remainingTime <= 0) {
        this.server.to(pinCode).emit('time end', { isEnd: true });
        clearInterval(intervalId);
        return;
      }
      this.server.to(pinCode).emit('timer tick', { currentTime, elapsedTime, remainingTime });
    }, 1000);
  }

  // 퀴즈를 푸는 동안 서버에저 제한시간을 측정한다.
  // 측정하는 동안에는 SSE를 시도한다.

  @SubscribeMessage('start quiz')
  async handleStartQuiz(client: Socket, payload: any) {
    const { sid, pinCode } = payload;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    client.to(pinCode).emit('start quiz', { isStarted: true });
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
    const submittedQuizOrder = currentOrder - 1;
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));
    const currentQuizData = quizData[submittedQuizOrder];

    const participantLength = participantList.length;
    // 현재 퀴즈의 초이스 데이터 가져옴
    const currentChoicesData = currentQuizData['choices'];

    const gameStatus = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${submittedQuizOrder}`),
    );

    // 제출 기록 저장 [[nickname, solveTime]]
    gameStatus['submitHistory'].push([pariticipantInfo.nickname, submitTime]);
    const submitHistory = gameStatus.submitHistory;

    //totalSubmit
    gameStatus.totalSubmit += 1;
    const totalSubmit = gameStatus.totalSubmit;

    //totalCorrect
    const isFlag = selectedAnswer.every((answer) => {
      return currentChoicesData[answer]['isCorrect'];
    });
    if (isFlag) {
      gameStatus.totalCorrect += 1;
    }
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

    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
    await this.redisService.set(
      `gameId=${pinCode}:quizId=${currentOrder}`,
      JSON.stringify(gameStatus),
    );

    const solveRate = (totalCorrect / totalSubmit) * 100;
    const averageTime = (totalTime / totalSubmit) * 100;
    const participantRate = (totalSubmit / participantNum) * 100;
    const participantStatistics = { totalSubmit, solveRate, averageTime, participantRate };

    ///participant length 넘기기
    const masterStatistics = {
      totalSubmit,
      solveRate,
      averageTime,
      participantRate,
      choiceStatus,
      submitHistory,
      participantLength,
    };
    client.to(pinCode).emit('total submit count', { totalSubmit });
    this.server.to(pinCode).emit('participant statistics', participantStatistics);
    this.server.to(pinCode).emit('master statistics', masterStatistics);
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
}
