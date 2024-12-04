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
import { Injectable, UseGuards } from '@nestjs/common';
import { MasterEntryRequestDto } from './dto/request/master-entry.request.dto';
import { ParticipantEntryRequestDto } from './dto/request/participant-entry.request.dto';
import { ShowQuizRequestDto } from './dto/request/show-quiz.request.dto';
import { StartQuizRequestDto } from './dto/request/start-quiz.request.dto';
import { EmojiRequestDto } from './dto/request/emoji.request.dto';
import { SubmitAnswerRequestDto } from './dto/request/submit-answer.request.dto';
import { ShowRankingRequestDto } from './dto/request/show-ranking.request.dto';
import { EndQuizRequestDto } from './dto/request/end-quiz.request.dto';
import { MessageRequestDto } from './dto/request/message.request.dto';
import { LeaderboardRequestDto } from './dto/request/leaderboard.request.dto';
import {
  MASTER_POSITION,
  QUIZ_WAITING_TIME,
  INTERVAL_TIME,
  PARTICIPANT_MAX_NUMBER,
} from '@shared/constants/game.constants';
import { CONVERT_TO_MS } from '@shared/constants/utils.constants';
import { CONNECTION_TYPES } from '@shared/types/connection.types';
import { GAMESTATUS_TYPES } from '@shared/types/gameStatus.types';
import { SessionGuard } from '../../guards/session.guard';

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
    const { sid } = client.handshake?.auth;
    if (!sid) {
      return;
    }

    const sidType = await this.gameService.checkSidType(sid);
    const key = sidType.type === 'master' ? `master_sid=${sid}` : `participant_sid=${sid}`;

    const data = JSON.parse(await this.redisService.get(key));

    if (data) {
      const { pinCode } = data;
      data['socketId'] = client.id;
      data['connection'] = CONNECTION_TYPES.ON;

      await this.redisService.set(key, JSON.stringify(data));
      client.join(pinCode);
    }
  }

  async handleDisconnect(client: Socket) {
    // TODO: 대기 중에 사람이 나갈 경우 갱신해주는 부분 추가 필요
    console.log(`Client disconnected: ${client.id}`);
    // TODO: connection 상태 변경 필요
    // 마스터 참여자 여부에 따라서 disconnection 관리 로직 다를듯
    // const timeoutKey = `timeout:${client.id}`;
    // await this.redisService.set(timeoutKey, 'delete', 'EX', 30);

    // // 30초 후 데이터 삭제 로직
    // setTimeout(async () => {
    //   const timeoutExists = await this.redisService.get(timeoutKey);
    //   if (timeoutExists) {
    //     await this.redisService.del(client.id);
    //   }
    // }, 30000);
  }

  @SubscribeMessage('master entry')
  async handleMasterEntry(client: Socket, payload: MasterEntryRequestDto) {
    const { classId } = payload;

    const masterSid = uuidv4();
    const pinCode = uuidv4().slice(0, 6); //TODO: 메소드 분리해서 중복 확인하고 없을 때까지 반복
    const socketId = client.id;

    const position = MASTER_POSITION;
    const connection = CONNECTION_TYPES.ON;

    const masterinfo = { pinCode, socketId, position, connection };

    client.join(pinCode);

    await this.redisService.set(`master_sid=${masterSid}`, JSON.stringify(masterinfo));

    const quizData = await this.storeQuizToRedis(classId);
    const quizMaxNum = quizData.length - 1;
    const gameStatus = GAMESTATUS_TYPES.WAITING;

    const gameInfo = { classId, gameStatus, currentOrder: -1, quizMaxNum, participantList: [] };

    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    client.emit('session', masterSid);
    client.emit('pincode', pinCode);
  }

  @SubscribeMessage('session')
  async handleSession(client: Socket, dto) {
    const { pinCode, nickname } = dto;
    const socketId = client.id;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    const participantLength = gameInfo.participantList.length;

    if (participantLength >= PARTICIPANT_MAX_NUMBER) {
      return undefined;
    }

    const participantSid = uuidv4();
    const character = Math.floor(Math.random() * 6);
    const position = participantLength;
    const connection = CONNECTION_TYPES.ON;

    const clientInfo = { pinCode, nickname, socketId, character, position, connection };

    client.join(pinCode);

    await this.redisService.set(`participant_sid=${participantSid}`, JSON.stringify(clientInfo));
    await this.redisService.zincrby(`gameId=${pinCode}:ranking`, 0, participantSid);

    const pariticipantInfo = { nickname, character, position, connection };
    gameInfo.participantList.push(pariticipantInfo);

    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    return participantSid;
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('participant notice')
  async handleParticipantNotice(client: Socket, dto) {
    const { pinCode } = dto;
    client.to(pinCode).emit('participant notice');
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('participant info')
  async handleNickname(client: Socket, dto) {
    const { pinCode, sid } = dto;
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    const sidType = await this.gameService.checkSidType(sid);
    const key = sidType.type === 'master' ? `master_sid=${sid}` : `participant_sid=${sid}`;

    const data = JSON.parse(await this.redisService.get(key));

    const myPosition = data.position;
    const participantList = gameInfo.participantList;

    return { myPosition, participantList };
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('start quiz')
  async handleStartQuiz(client: Socket, payload: StartQuizRequestDto) {
    const { sid, pinCode } = payload;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    // 퀴즈 진행 상태로 변경
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = GAMESTATUS_TYPES.IN_PROGRESS;

    const { classId, currentOrder, quizMaxNum } = gameInfo;

    const updatedCurrentOrder = currentOrder + 1;
    gameInfo.currentOrder = updatedCurrentOrder;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    // TODO:캐싱된 퀴즈를 가져온다. 퀴즈를 생성할 경우, 만들어졌을거라 예상
    // 만일 레디스에 퀴즈가 저장되어있지않다면, 퀴즈를 다시 캐싱해오는 로직이 필요할지도.

    // 퀴즈 데이터 가져오기, 초이스 개수를 알아야하기 위해 -> 이후 초이스 배열 만들어야함
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));
    console.log('upadate', updatedCurrentOrder);
    const currentQuizData = quizData.find((quiz) => quiz.position === updatedCurrentOrder);

    const choicesLength = currentQuizData['choices'].length;
    const choiceStatus = Object.fromEntries(
      Array.from({ length: choicesLength }, (_, i) => [i, 0]),
    );
    const startTime = Date.now();

    const gameStatus = {
      totalSubmit: 0,
      totalCorrect: 0,
      totalTime: 0,
      choiceStatus,
      submitHistory: [],
      emojiStatus: { easy: 0, hard: 0 },
      startTime,
    };

    await this.redisService.set(
      `gameId=${pinCode}:quizId=${updatedCurrentOrder}`,
      JSON.stringify(gameStatus),
    );
    console.log('start quiz', client.id, updatedCurrentOrder);
    // 마스터가 참여자들에게 게임 시작을 알림, 이 알림을 받은 참여자는 showranking을 시작한다.
    client.to(pinCode).emit('start quiz', { isStarted: true });
    return { isStarted: true };
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('show quiz')
  async handleShowQuiz(client: Socket, payload: ShowQuizRequestDto) {
    const { pinCode } = payload;
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    const { classId, currentOrder, quizMaxNum, participantList } = gameInfo;
    // TODO:캐싱된 퀴즈를 가져온다. 퀴즈를 생성할 경우, 만들어졌을거라 예상
    // 만일 레디스에 퀴즈가 저장되어있지않다면, 퀴즈를 다시 캐싱해오는 로직이 필요할지도.

    // 퀴즈 데이터 가져오기 이건 참여자들에게 보여줄려고 get한 데이터
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));

    const currentQuizData = quizData.find((quiz) => quiz.position === currentOrder);

    const isLast = gameInfo.currentOrder === quizMaxNum ? true : false;

    // 기존에 퀴즈가 저장된적이 있는지. start quiz에 저장되어있음
    const quizRedis = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${currentOrder}`),
    );

    const participantLength = participantList.length;

    const startTime = quizRedis.startTime;
    return { quizMaxNum, currentQuizData, startTime, isLast, participantLength };
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

  // @UseGuards(SessionGuard)
  @SubscribeMessage('submit answer')
  async handleSubmitAnswer(client: Socket, payload: SubmitAnswerRequestDto) {
    const { pinCode, sid, selectedAnswer, submitTime } = payload;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    const pariticipantInfo = JSON.parse(await this.redisService.get(`participant_sid=${sid}`));

    const { classId, currentOrder, participantList } = gameInfo;
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));
    const currentQuizData = quizData[currentOrder];

    const participantLength = participantList.length;

    const currentChoicesData = currentQuizData['choices'];
    const { point, timeLimit } = currentQuizData;

    const gameStatus = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${currentOrder}`),
    );

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

    gameStatus.totalTime += submitTime;
    const totalTime = gameStatus.totalTime;

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

  // @UseGuards(SessionGuard)
  @SubscribeMessage('emoji')
  async handleEmoji(client: Socket, payload: EmojiRequestDto) {
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
    const timeLimitToMs = (timeLimit + QUIZ_WAITING_TIME) * CONVERT_TO_MS;
    if (isFlag) {
      const ratio = (timeLimitToMs - submitTime) / timeLimitToMs;
      return Math.floor(ratio * point);
    }
    return 0;
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('time end')
  async handleTimeEnd(client: Socket, payload: any) {
    const { pinCode } = payload;
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('show ranking')
  async handleShowRanking(client: Socket, payload: ShowRankingRequestDto) {
    const { pinCode, sid } = payload;

    const participantNumber = await this.redisService.zcard(`gameId=${pinCode}:ranking`);
    const allRankers = await this.gameService.getRank(
      `gameId=${pinCode}:ranking`,
      participantNumber,
    );

    const rankerData = await Promise.all(
      allRankers.map(async ([sid, score]) => {
        const { nickname } = JSON.parse(await this.redisService.get(`participant_sid=${sid}`));
        return { nickname, score };
      }),
    );

    const myRank = await this.redisService.zrevrank(`gameId=${pinCode}:ranking`, sid);
    const myScore = await this.redisService.zscore(`gameId=${pinCode}:ranking`, sid);
    const { nickname: myNickname } = JSON.parse(
      await this.redisService.get(`participant_sid=${sid}`),
    );
    const showRankingData = { rankerData, myRank, myScore, myNickname };

    return showRankingData;
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('end quiz')
  async handleEndQuiz(client: Socket, payload: EndQuizRequestDto) {
    const { sid, pinCode } = payload;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    client.to(pinCode).emit('end quiz', { isEnded: true });

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = GAMESTATUS_TYPES.END;
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

  // @UseGuards(SessionGuard)
  @SubscribeMessage('leaderboard')
  async handleLeaderboard(client: Socket, payload: LeaderboardRequestDto) {
    const { pinCode } = payload;

    const participantNumber = await this.redisService.zcard(`gameId=${pinCode}:ranking`);
    const allRankers = await this.gameService.getRank(
      `gameId=${pinCode}:ranking`,
      participantNumber,
    );

    const rankerData = await Promise.all(
      allRankers.map(async ([sid, score]) => {
        const { nickname, character } = JSON.parse(
          await this.redisService.get(`participant_sid=${sid}`),
        );
        return { nickname, score, character };
      }),
    );

    const allParticipantsScore = rankerData.reduce((acc, { score }) => acc + Number(score), 0);
    const averageScore = allParticipantsScore / participantNumber;

    const leaderboardData = { rankerData, participantNumber, averageScore };

    // TODO: 이벤트 어떤 형식으로 전달할 지 정해야 함
    return leaderboardData;
  }

  // @UseGuards(SessionGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: MessageRequestDto) {
    const { pinCode, message, position } = payload;
    this.server.to(pinCode).emit('message', { message, position });
  }

  @SubscribeMessage('my info')
  async handleMyInfo(client: Socket, payload: any) {
    const { sid } = payload;
    const sidType = await this.gameService.checkSidType(sid);
    const key = sidType.type === 'master' ? `master_sid=${sid}` : `participant_sid=${sid}`;

    const { nickname, character } = JSON.parse(await this.redisService.get(key));

    return { nickname, character };
  }
}
