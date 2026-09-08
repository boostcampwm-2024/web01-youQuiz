import { redisGetJSON } from './redis';

// 서버(GameGateway)의 currentOrder(0-based, Redis `gameId=<pinCode>`)가 유일한
// 진실이다. 클라이언트 라우트의 :id는 표시용일 뿐 서버로 전송되지 않으므로
// 화면 URL 숫자와 다를 수 있다 — 이 파일의 함수들은 항상 서버 값을 반환한다.

export interface GameParticipant {
  nickname: string;
  character: number;
  position: number;
  connection: 'ON' | 'OFF';
}

export interface GameInfo {
  classId: number;
  gameStatus: string;
  currentOrder: number;
  quizMaxNum: number;
  participantList: GameParticipant[];
}

export interface QuizState {
  totalSubmit: number;
  totalCorrect: number;
  totalTime: number;
  choiceStatus: Record<string, number>;
  submitHistory: [string, number][];
  emojiStatus: { easy: number; hard: number };
  startTime: number;
}

export function getGameInfo(pinCode: string): GameInfo | undefined {
  return redisGetJSON<GameInfo>(`gameId=${pinCode}`);
}

export function getQuizState(pinCode: string, currentOrder: number): QuizState | undefined {
  return redisGetJSON<QuizState>(`gameId=${pinCode}:quizId=${currentOrder}`);
}

export function getParticipantCount(pinCode: string): number {
  return getGameInfo(pinCode)?.participantList.length ?? 0;
}

export function getCurrentOrder(pinCode: string): number | undefined {
  return getGameInfo(pinCode)?.currentOrder;
}
