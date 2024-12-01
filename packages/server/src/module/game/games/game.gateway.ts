import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../../config/database/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';
import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
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
} from '@shared/constants/game.constants';
import { CONVERT_TO_MS } from '@shared/constants/utils.constants';
import { CONNECTION_TYPES } from '@shared/types/connection.types';
import { GAMESTATUS_TYPES } from '@shared/types/gameStatus.types';
import { GameGatewayService } from './game.gateway.service';

@Injectable()
@UsePipes(ValidationPipe)
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
    private readonly gameGatewayService: GameGatewayService,
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
      const { pinCode, position } = data;
      data['socketId'] = client.id;
      data['connection'] = CONNECTION_TYPES.ON;

      await this.redisService.set(key, JSON.stringify(data));
      client.join(pinCode);

      const gameInfoJson = await this.redisService.get(`gameId=${pinCode}`);
      if (gameInfoJson) {
        const gameInfo = JSON.parse(gameInfoJson);
        const myPositionData = { participantList: gameInfo.participantList, myPosition: position };
        client.emit('my position', myPositionData);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    // TODO: 대기 중에 사람이 나갈 경우 갱신해주는 부분 추가 필요
    console.log(`Client disconnected: ${client.id}`);
    // TODO: connection 상태 변경 필요
    // 마스터 참여자 여부에 따라서 disconnection 관리 로직 다를듯
  }

  @SubscribeMessage('master entry')
  async handleMasterEntry(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: MasterEntryRequestDto,
  ) {
    this.gameGatewayService.handleMasterEntry(client, dto);
  }

  @SubscribeMessage('participant entry')
  async handleParticipantEntry(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ParticipantEntryRequestDto,
  ) {
    const response = await this.gameGatewayService.handleParticipantEntry(client, dto);
    client.emit('my position', response.myPositionData);
    client.to(dto.pinCode).emit('nickname', response.nicknameEventData);
  }

  async handleShowQuiz(@ConnectedSocket() client: Socket, @MessageBody() dto: ShowQuizRequestDto) {
    const { pinCode } = dto;

    const { gameInfo, currentQuizData, currentTimeLimit, isLast } =
      await this.gameGatewayService.getQuizData(pinCode);

    const choicesLength = currentQuizData['choices'].length;

    await this.gameGatewayService.initializeGameStatus(
      pinCode,
      gameInfo.currentOrder,
      choicesLength,
    );

    this.server.to(pinCode).emit('show quiz', {
      quizMaxNum: gameInfo.quizMaxNum,
      currentQuizData,
      isLast,
    });

    const startTime = Date.now();
    this.intervalTimeSender(pinCode, startTime, currentTimeLimit);
  }

  private async intervalTimeSender(pinCode: string, startTime: number, timeLimit: number) {
    const intervalId = setInterval(async () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const remainingTime = (timeLimit + QUIZ_WAITING_TIME) * 1000 - elapsedTime;

      if (remainingTime <= 0) {
        await this.gameGatewayService.updateGameOrder(pinCode);
        this.server.to(pinCode).emit('time end', { isEnd: true });
        clearInterval(intervalId);
        return;
      }

      this.server.to(pinCode).emit('timer tick', { currentTime, elapsedTime, remainingTime });
    }, INTERVAL_TIME);
  }

  @SubscribeMessage('start quiz')
  async handleStartQuiz(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: StartQuizRequestDto,
  ) {
    const response = await this.gameGatewayService.handleStartQuiz(dto);
    client.to(dto.pinCode).emit('start quiz', response);
  }

  @SubscribeMessage('submit answer')
  async handleSubmitAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SubmitAnswerRequestDto,
  ) {
    const response = await this.gameGatewayService.handleSubmitAnswer(dto);
    this.server.to(dto.pinCode).emit('participant statistics', response.participantStatistics);
    this.server.to(dto.pinCode).emit('master statistics', response.masterStatistics);
    return response.submitOrder;
  }

  @SubscribeMessage('emoji')
  async handleEmoji(@ConnectedSocket() client: Socket, @MessageBody() dto: EmojiRequestDto) {
    const response = await this.gameGatewayService.handleEmoji(dto);
    this.server.to(dto.pinCode).emit('emoji', response);
  }

  @SubscribeMessage('show ranking')
  async handleShowRanking(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ShowRankingRequestDto,
  ) {
    const response = await this.gameGatewayService.handleShowRanking(dto);
    return response;
  }

  @SubscribeMessage('end quiz')
  async handleEndQuiz(@ConnectedSocket() client: Socket, @MessageBody() dto: EndQuizRequestDto) {
    const response = await this.gameGatewayService.handleEndQuiz(dto);
    client.to(dto.pinCode).emit('end quiz', response);
  }

  @SubscribeMessage('leaderboard')
  async handleLeaderboard(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: LeaderboardRequestDto,
  ) {
    const leaderboardData = await this.gameGatewayService.getLeaderBoadrd(dto);
    // TODO: 이벤트 어떤 형식으로 전달할 지 정해야 함
    return leaderboardData;
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: MessageRequestDto) {
    const response = await this.gameGatewayService.handleMessage(dto);
    this.server.to(dto.pinCode).emit('message', response);
  }
}
