import { Socket } from 'socket.io-client';

export const emitEventWithDelay = (socket: Socket, event: string, data: any, delay: number) => {
  return new Promise((resolve) => {
    socket.emit(event, data);
    setTimeout(() => {
      resolve(true);
    }, delay);
  });
};
