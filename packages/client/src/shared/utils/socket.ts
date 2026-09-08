import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';

let socket: Socket | null = null;

export function getQuizSocket(): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_SERVER_URL}/game`, {
      // auth를 정적 객체로 주면 최초 연결 시점(쿠키 설정 전일 수 있음)의 값이
      // 이후 모든 자동 재연결 시도에도 그대로 재사용된다. 함수형으로 주면
      // 매 (재)연결 시도마다 다시 평가되어 최신 sid 쿠키를 보낸다.
      auth: (cb) => cb({ sid: getCookie('sid') }),
      transports: ['websocket'],
    });
  }
  return socket;
}
