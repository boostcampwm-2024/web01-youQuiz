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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisService: RedisService) {}
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

  // payload = {ClassId}
  // 방장 최초 접속
  @SubscribeMessage('master entry')
  handleMasterEntry(client: Socket, payload: any) {
    // 방장 롤 부여해야함
    // 방장이 게임을 나가도 재접속이 가능하며, 게임은 지속된다.

    /**
     * 1. classID를 클라이언트에서 받아서 방장 SID: classID 레디스 저장
     * 2. 게임 핀 번호를 생성함 ( roomID ) -> client 던져줌
     * 3. class ID : {1: {퀴즈 1}, 2: {퀴즈 2} } 유효 시
     */

    const { classId } = payload;
    const masterInfo = { classId };
    const sid = uuidv4();
    this.redisService.set(`master_sid=${sid}`, JSON.stringify(masterInfo));
    client.emit('session', { sid });

    // get-pincode 핀코드 생성 후 보내기
  }
  // 방장 ID : class ID
  // class ID : {1: {퀴즈 1}, 2: ㅋ ㅣ즈 2 } 유효 시

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
