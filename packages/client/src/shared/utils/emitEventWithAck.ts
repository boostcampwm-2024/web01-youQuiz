import { Socket } from 'socket.io-client';

export const emitEventWithAck = <T>(socket: Socket, event: string, data: any) => {
  return new Promise<T>((resolve, reject) => {
    socket.emit(event, data, (response: T) => {
      if (response) {
        resolve(response);
      } else {
        reject(new Error(`"${event}" event emit failed`));
      }
    });
  });
};
