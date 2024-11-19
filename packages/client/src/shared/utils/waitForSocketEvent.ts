import { Socket } from 'socket.io-client';

export const waitForSocketEvent = (eventName: string, socket: Socket): Promise<any> =>
  new Promise((resolve) => {
    socket.once(eventName, (response) => {
      resolve(response);
    });
  });
