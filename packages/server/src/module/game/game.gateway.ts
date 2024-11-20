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

    // client.emit('nickname', gameInfo.participantList);
    // client.to(pinCode).emit('nickname', gameInfo.participantList);
    this.server.to(pinCode).emit('nickname', gameInfo.participantList);
  }

  @SubscribeMessage('nickname')
  async handleNickname(client: Socket, payload: any) {
    const { pinCode } = payload;

    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    // client.emit('nickname', gameInfo.participantList);
    // client.to(pinCode).emit('nickname', gameInfo.participantList);
    this.server.to(pinCode).emit('nickname', gameInfo.participantList);
  }

  @SubscribeMessage('show quiz')
  async handleShowQuiz(client: Socket, payload: any) {
    // const isMaster = await this.

    const { pinCode } = payload;
    // 게임 현재 상태 가져오기
    const gameInfo = JSON.parse(await this.redisService.get(`gameId=${pinCode}`));

    const { classId, currentOrder, participantList } = gameInfo;
    // 캐싱된 퀴즈를 가져온다. 퀴즈를 생성할 경우, 만들어졌을거라 예상
    // 만일 레디스에 퀴즈가 저장되어있지않다면, 퀴즈를 다시 캐싱해오는 로직이 필요할지도.
    const quizData = JSON.parse(await this.redisService.get(`classId=${classId}`));

    const currentQuizData = quizData[currentOrder];

    // client.emit('show quiz', currentQuizData);
    // client.to(pinCode).emit('show quiz', currentQuizData);
    this.server.to(pinCode).emit('show quiz', currentQuizData);

    // gameInfo.currentOrder += 1;
    await this.redisService.set(`gameId=${pinCode}`, JSON.stringify(gameInfo));

    // setTimeout(() => {
    //   this.startTimer(pinCode, currentQuizData.timeLimit);
    // }, 2000);

    // redis currentOrder + 1
  }

  // 퀴즈를 푸는 동안 서버에저 제한시간을 측정한다.
  // 측정하는 동안에는 SSE를 시도한다.

  //퀴즈를 보내고 나서 타이머 재기 시작
  // 타이머가 끝나면 이벤트 발생 - 타이머 종료 알림

  private async storeQuizToRedis(classId: number) {
    const cachedQuizData = await this.redisService.get(`classId=${classId}`);

    if (cachedQuizData) {
      const quizData = JSON.parse(cachedQuizData);
      return quizData;
    }

    const quizData = await this.gameService.cachingQuizData(classId);

    await this.redisService.set(`class:${classId}`, JSON.stringify(quizData), 'EX', 604800);

    return quizData;
  }
}
