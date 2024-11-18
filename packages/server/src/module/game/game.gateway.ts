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
  // 클라이언트가 연결했을 때 처리하는 메서드
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // 클라이언트가 연결을 끊었을 때 처리하는 메서드
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('Quiz')
  handleQuiz(client: Socket, payload: any) {
    // classID, 퀴즈의 정보를 가져온다.
    const quiz = this.redisService.get(payload.classId);
  }

  @SubscribeMessage('submit')
  handleSubmit() {}

  @SubscribeMessage('master entry')
  async handleMasterEntry(client: Socket, payload: any) {
    // 방장이 게임을 나가도 재접속이 가능하며, 게임은 지속된다.

    const masterSid = uuidv4();
    const gamePin = uuidv4().slice(0, 6); // 메소드 분리해서 중복 확인하고 없을 때까지 반복
    this.redisService.set(`master_sid=${masterSid}`, gamePin);

    const { classId } = payload;
    const gameInfo = { classId, currentOrder: 0, clientNum: 0, participantList: [] };

    this.redisService.set(`gameId=${gamePin}`, JSON.stringify(gameInfo));

    // refactor: 캐싱이 되어있다면 기간 연장, 안되어있다면 MySQL에서 데이터 가져오기, 데이터 전처리
    const quizData = await this.gameService.cachingQuizData(classId);
    this.redisService.set(`classId=${classId}`, JSON.stringify(quizData));

    client.emit('session', masterSid);
    client.emit('pincode', gamePin);
  }

  @SubscribeMessage('participant entry')
  handleParticipantEntry(client: Socket, payload: any) {
    const { roomId, nickname } = payload;
    const clientInfo = { roomId, nickname };

    if (payload.sid) {
      this.redisService.set(`participant_sid=${payload.sid}`, JSON.stringify(clientInfo));
      return;
    }

    const sid = uuidv4();
    this.redisService.set(`participant_sid=${sid}`, JSON.stringify(clientInfo));
    client.emit('session', { sid });

    // 해당 게임 아이디에 있는 모든 사람들한테 nickname braodcast

    return;
  }
}
