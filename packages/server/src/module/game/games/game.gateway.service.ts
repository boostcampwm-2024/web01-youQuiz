import { Injectable } from '@nestjs/common';
import {
  MASTER_POSITION,
  QUIZ_WAITING_TIME,
  INTERVAL_TIME,
} from '@shared/constants/game.constants';
import { CONVERT_TO_MS } from '@shared/constants/utils.constants';
import { CONNECTION_TYPES } from '@shared/types/connection.types';
import { GAMESTATUS_TYPES } from '@shared/types/gameStatus.types';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/config/database/redis/redis.service';
import { MasterEntryRequestDto } from './dto/request/master-entry.request.dto';
import { Socket } from 'socket.io';
import { Quiz } from 'src/module/quiz/quizzes/entities/quiz.entity';
import { ClassRepository } from 'src/module/quiz/quizzes/repositories/class.repository';
import { MessageRequestDto } from './dto/request/message.request.dto';
import { MessageResponseDto } from './dto/response/message.response.dto';
import { EndQuizRequestDto } from './dto/request/end-quiz.request.dto';
import { EndQuizResponseDto } from './dto/response/end-quiz.response.dto';
import { EmojiRequestDto } from './dto/request/emoji.request.dto';
import { EmojiResponseDto } from './dto/response/emoji.response.dto';
import { SubmitAnswerRequestDto } from './dto/request/submit-answer.request.dto';
import { SubmitAnswerResponseDto } from './dto/response/submit-answer.response.dto';
import { MasterStatisticsResponseDto } from './dto/response/masterStatistics.response.dto';
import { ParticipantStatisticsResponseDto } from './dto/response/participantStatistics.response.dto';
import { ShowQuizRequestDto } from './dto/request/show-quiz.request.dto';
import { ShowRankingRequestDto } from './dto/request/show-ranking.request.dto';
import { ShowRankingResponseDto } from './dto/response/show-ranking.response.dto';
import { RankerData } from './interfaces/rankerData.interface';
import { ClientInfo } from './interfaces/clientInfo.interface';
import { RankerInfo } from './interfaces/rankerInfo.interface';
import { StartQuizRequestDto } from './dto/request/start-quiz.request.dto';
import { StartQuizResponseDto } from './dto/response/start-quiz.response.dto';
import { ParticipantEntryRequestDto } from './dto/request/participant-entry.request.dto';
import { NicknameEventDataResponseDto } from './dto/response/nicknameEventData.response.dto';
import { MyPositionDataResponseDto } from './dto/response/myPositionData.response.dto';
import { ParticipantEntryResponseDto } from './dto/response/participant-entry.response.dto';

@Injectable()
export class GameGatewayService {
  constructor(
    private readonly redisService: RedisService,
    private readonly classRepository: ClassRepository,
  ) {}

  async handleParticipantEntry(
    client: Socket,
    dto: ParticipantEntryRequestDto,
  ): Promise<ParticipantEntryResponseDto> {
    const { pinCode, nickname } = dto;
    const socketId = client.id;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    // TODO: 만약 participant.length가 32로 제한이면 더이상 못들어오도록 막아야함 -> gameState를 업데이트?
    const character = Math.floor(Math.random() * 6);
    const position = gameInfo.participantList.length;
    const connection = CONNECTION_TYPES.ON;

    const clientInfo = { pinCode, nickname, socketId, character, position, connection };

    client.join(pinCode);

    const participantSid = uuidv4();
    await this.redisService.set(`participant_sid=${participantSid}`, JSON.stringify(clientInfo));
    client.emit('session', participantSid);

    await this.redisService.zincrby(`gameId=${pinCode}:ranking`, 0, participantSid);

    const pariticipantInfo = { nickname, character, position, connection };
    gameInfo.participantList.push(pariticipantInfo);
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const nicknameEventData = new NicknameEventDataResponseDto(gameInfo.participantList);
    const myPositionData = new MyPositionDataResponseDto(gameInfo.participantList, position);

    const response = new ParticipantEntryResponseDto(nicknameEventData, myPositionData);
    return response;
  }

  async handleMasterEntry(client: Socket, dto: MasterEntryRequestDto) {
    const { classId } = dto;

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

    const gameInfo = { classId, gameStatus, currentOrder: 0, quizMaxNum, participantList: [] };

    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    client.emit('session', masterSid);
    client.emit('pincode', pinCode);
  }

  async handleSubmitAnswer(dto: SubmitAnswerRequestDto): Promise<SubmitAnswerResponseDto> {
    const { pinCode, sid, selectedAnswer, submitTime } = dto;

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

    const participantStatistics = new ParticipantStatisticsResponseDto(
      totalSubmit,
      solveRate,
      averageTime,
      participantRate,
    );
    const masterStatistics = new MasterStatisticsResponseDto(
      totalSubmit,
      solveRate,
      averageTime,
      participantRate,
      choiceStatus,
      submitHistory,
      participantLength,
    );

    const response = new SubmitAnswerResponseDto(
      participantStatistics,
      masterStatistics,
      totalSubmit,
    );
    return response;
  }

  private async storeQuizToRedis(classId: number) {
    const cachedQuizData = await this.redisService.get(`classId=${classId}`);

    if (cachedQuizData) {
      const quizData = JSON.parse(cachedQuizData);
      return quizData;
    }

    const quizData = await this.cachingQuizData(classId);

    await this.redisService.set(`classId=${classId}`, JSON.stringify(quizData), 'EX', 604800);

    return quizData;
  }

  async cachingQuizData(classId: number) {
    const classWithRelations = await this.findClassWithRelations(classId);
    const transformedData = this.transformQuizData(classWithRelations);

    return transformedData;
  }

  async findClassWithRelations(id: number) {
    const classEntity = await this.classRepository.getOnlyQuiz(id);

    return classEntity?.quizzes || [];
  }

  private transformQuizData(quizlists: Quiz[]) {
    const result = [];

    quizlists.forEach((quiz) => {
      const choiceList = [];
      quiz.choices.forEach((choice) => {
        const { id, quizId, content, isCorrect, position } = choice;
        const oneChoice = { id, quizId, content, isCorrect, position }; // 인터페이스로 refactor
        choiceList.push(oneChoice);
      });

      const { id, content, quizType, timeLimit, point, position } = quiz;
      const oneQuiz = { id, content, quizType, timeLimit, point, position, choices: choiceList }; // 인터페이스로 refactor
      result.push(oneQuiz);
    });
    return result;
  }

  async getLeaderBoadrd(dto) {
    const { pinCode } = dto;

    const participantNumber = await this.redisService.zcard(`gameId=${pinCode}:ranking`);
    const allRankers = await this.getRank(`gameId=${pinCode}:ranking`, participantNumber);

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
    return leaderboardData;
  }

  async handleStartQuiz(dto: StartQuizRequestDto): Promise<StartQuizResponseDto> {
    const { sid, pinCode } = dto;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = GAMESTATUS_TYPES.IN_PROGRESS;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const response = new StartQuizResponseDto(true);
    return response;
  }

  async getQuizData(pinCode: string) {
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    const { classId, currentOrder, quizMaxNum } = gameInfo;

    // 캐싱된 퀴즈 데이터를 가져옵니다.
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));
    const currentQuizData = quizData[currentOrder];
    const currentTimeLimit = currentQuizData['timeLimit'];
    const isLast = currentOrder === quizMaxNum;

    return { gameInfo, currentQuizData, currentTimeLimit, isLast };
  }

  async initializeGameStatus(pinCode: string, currentOrder: number, choicesLength: number) {
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
  }

  async updateGameOrder(pinCode: string) {
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.currentOrder += 1;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));
  }

  async handleShowRanking(dto: ShowRankingRequestDto): Promise<ShowRankingResponseDto> {
    const { pinCode, sid } = dto;

    const participantNumber = await this.redisService.zcard(`gameId=${pinCode}:ranking`);
    const allRankers = await this.getRank(`gameId=${pinCode}:ranking`, participantNumber);

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
    const response = new ShowRankingResponseDto(rankerData, myRank, myScore, myNickname);
    return response;
  }

  async handleEndQuiz(dto: EndQuizRequestDto): Promise<EndQuizResponseDto> {
    const { sid, pinCode } = dto;

    const { pinCode: storedPinCode } = JSON.parse(await this.redisService.get(`master_sid=${sid}`));

    if (storedPinCode !== pinCode) {
      console.log('Invalid pinCode');
    }

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));
    gameInfo.gameStatus = GAMESTATUS_TYPES.END;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    const response = new EndQuizResponseDto(true);
    return response;
  }

  async handleEmoji(dto: EmojiRequestDto): Promise<EmojiResponseDto> {
    const { pinCode, currentOrder, emoji } = dto;
    const gameStatus = JSON.parse(
      await this.redisService.get(`gameId=${pinCode}:quizId=${currentOrder}`),
    );
    gameStatus.emojiStatus[emoji] += 1;
    await this.redisService.set(
      `gameId=${pinCode}:quizId=${currentOrder}`,
      JSON.stringify(gameStatus),
    );

    const response = new EmojiResponseDto(gameStatus.emojiStatus);
    return response;
  }

  async handleMessage(dto: MessageRequestDto): Promise<MessageResponseDto> {
    const { message, position } = dto;
    const reponse = new MessageResponseDto(message, position);
    return reponse;
  }

  async getRank(key: string, participantNum: number) {
    const result = await this.redisService.zrevrange(key, 0, participantNum);

    const formattedRank = result
      .map((item, index) => {
        if (index % 2 === 0) {
          return [item, result[index + 1]];
        }
      })
      .filter((item) => item !== undefined);

    return formattedRank;
  }

  private matchingAnswer(selectedAnswer: Number[], currentChoicesData) {
    const correctAnswers = currentChoicesData
      .map((choice, index) => (choice.isCorrect ? index : null))
      .filter((index) => index !== null);

    const equals = (a: Number[], b: Number[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    correctAnswers.sort();
    selectedAnswer.sort();

    return equals(selectedAnswer, correctAnswers);
  }

  private calculatePoints(isFlag: boolean, submitTime: number, timeLimit: number, point: number) {
    const timeLimitToMs = (timeLimit + QUIZ_WAITING_TIME) * CONVERT_TO_MS;
    if (isFlag) {
      const ratio = (timeLimitToMs - submitTime) / timeLimitToMs;
      return Math.floor(ratio * point);
    }
    return 0;
  }
}
