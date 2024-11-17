import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getQuizSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:3000/game');
  }
  return socket;
}
