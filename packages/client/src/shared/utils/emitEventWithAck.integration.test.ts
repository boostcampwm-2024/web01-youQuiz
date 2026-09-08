import { describe, it, expect, afterEach } from 'vitest';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Server as IOServer } from 'socket.io';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import { emitEventWithAck } from './emitEventWithAck';

// 실제 socket.io 서버·클라이언트를 루프백으로 연결한 통합 테스트.
// 여기 서버는 최소 fixture이며 실제 GameGateway가 아님 - 전송 경로만 검증.

let httpServer: ReturnType<typeof createServer> | undefined;
let ioServer: IOServer | undefined;
let clientSocket: ClientSocket | undefined;

async function startServer(handler: (data: any, ack: (res?: any) => void) => void) {
  httpServer = createServer();
  ioServer = new IOServer(httpServer, { transports: ['websocket'] });
  ioServer.on('connection', (socket) => {
    socket.on('show quiz', handler);
  });

  await new Promise<void>((resolve) => httpServer!.listen(0, '127.0.0.1', resolve));
  const port = (httpServer!.address() as AddressInfo).port;
  return port;
}

async function connectClient(port: number) {
  clientSocket = ioClient(`http://127.0.0.1:${port}`, {
    transports: ['websocket'],
    reconnection: false,
  });
  await new Promise<void>((resolve, reject) => {
    clientSocket!.once('connect', () => resolve());
    clientSocket!.once('connect_error', reject);
  });
  return clientSocket;
}

afterEach(async () => {
  clientSocket?.disconnect();
  clientSocket = undefined;
  await new Promise<void>((resolve) => ioServer?.close(() => resolve()));
  await new Promise<void>((resolve) => httpServer?.close(() => resolve()));
  ioServer = undefined;
  httpServer = undefined;
});

describe('emitEventWithAck (real socket.io loopback)', () => {
  it('resolves with the server ack payload on a normal round trip', async () => {
    const port = await startServer((data, ack) => ack({ quizMaxNum: 4, pinCode: data.pinCode }));
    const socket = await connectClient(port);

    const result = await emitEventWithAck(socket, 'show quiz', { pinCode: 'ABC123' }, 3000);
    expect(result).toEqual({ quizMaxNum: 4, pinCode: 'ABC123' });
  });

  it('rejects once the ack timeout elapses when the server never acks', async () => {
    const port = await startServer(() => {});
    const socket = await connectClient(port);

    const start = Date.now();
    await expect(emitEventWithAck(socket, 'show quiz', { pinCode: 'ABC123' }, 300)).rejects.toThrow();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000);
  });

  it('first send times out (server silent), retried send over the same connection succeeds', async () => {
    let callCount = 0;
    const port = await startServer((_data, ack) => {
      callCount += 1;
      if (callCount === 1) return; // 첫 요청 유실 시뮬레이션
      ack({ quizMaxNum: 7, attempt: callCount });
    });
    const socket = await connectClient(port);

    await expect(emitEventWithAck(socket, 'show quiz', { pinCode: 'X' }, 300)).rejects.toThrow();
    const result = await emitEventWithAck(socket, 'show quiz', { pinCode: 'X' }, 3000);

    expect(result).toEqual({ quizMaxNum: 7, attempt: 2 });
    expect(callCount).toBe(2);
  });

  it('total sends stay bounded (no duplication) across a timeout + one retry, then failure', async () => {
    const port = await startServer(() => {});
    const socket = await connectClient(port);

    let attempts = 0;
    const runAttempt = async () => {
      attempts += 1;
      return emitEventWithAck(socket, 'show quiz', { pinCode: 'X' }, 300);
    };

    await expect(runAttempt()).rejects.toThrow();
    await expect(runAttempt()).rejects.toThrow();

    expect(attempts).toBe(2); // retry:1만큼, 중복 없음
  });

  it('a request in flight when the connection drops ends (rejects or stays observably pending), not silently "succeeds"', async () => {
    const port = await startServer(() => {});
    const socket = await connectClient(port);

    const promise = emitEventWithAck(socket, 'show quiz', { pinCode: 'X' }, 5000);
    let settled = false;
    let outcome: 'resolved' | 'rejected' | undefined;
    promise.then(
      () => {
        settled = true;
        outcome = 'resolved';
      },
      () => {
        settled = true;
        outcome = 'rejected';
      },
    );

    await new Promise((r) => setTimeout(r, 100));
    socket.disconnect();
    await new Promise((r) => setTimeout(r, 300));

    // 연결 끊김이 성공으로 둔갑하면 안 됨
    expect(outcome).not.toBe('resolved');
    if (!settled) {
      await expect(promise).rejects.toThrow();
    }
  });
});
