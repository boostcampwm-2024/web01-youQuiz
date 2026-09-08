import { Socket } from 'socket.io-client';

export const DEFAULT_ACK_TIMEOUT_MS = 3000;

export const emitEventWithAck = <T>(
  socket: Socket,
  event: string,
  data: any,
  ackTimeoutMs: number = DEFAULT_ACK_TIMEOUT_MS,
) => {
  return new Promise<T>((resolve, reject) => {
    socket.timeout(ackTimeoutMs).emit(event, data, (err: Error | null, response: T) => {
      if (err) {
        reject(err);
        return;
      }
      if (response) {
        resolve(response);
      } else {
        reject(new Error(`"${event}" event emit failed`));
      }
    });
  });
};
