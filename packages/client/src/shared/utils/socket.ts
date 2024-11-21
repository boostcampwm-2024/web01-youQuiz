import { io, Socket } from 'socket.io-client';
import { getCookie } from './cookie';

let socket: Socket | null = null;

export function getQuizSocket(): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_SERVER_URL}/game`, {
      auth: { sid: getCookie('sid') },
      transports: ['websocket'],
    });
  }
  return socket;
}
