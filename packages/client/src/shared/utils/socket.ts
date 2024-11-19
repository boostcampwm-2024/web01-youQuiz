import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getQuizSocket(): Socket {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_SERVER_URL}/game`);
  }
  return socket;
}
