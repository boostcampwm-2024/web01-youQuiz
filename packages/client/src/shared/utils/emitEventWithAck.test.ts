import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { emitEventWithAck, DEFAULT_ACK_TIMEOUT_MS } from './emitEventWithAck';

// socket.io-client의 .timeout(ms).emit(event, data, cb) 동작을 흉내낸 fake socket
function makeTimeoutAwareFakeSocket(behavior: {
  onEmit: (event: string, data: any, ms: number) => 'never' | { response: any };
}) {
  const emit = vi.fn((event: string, data: any, cb: (err: Error | null, res?: any) => void) => {
    const currentMs = (emit as any)._lastTimeoutMs;
    const result = behavior.onEmit(event, data, currentMs);
    if (result === 'never') {
      const timer = setTimeout(() => {
        cb(new Error('operation has timed out'));
      }, currentMs);
      (emit as any)._pendingTimers = (emit as any)._pendingTimers || [];
      (emit as any)._pendingTimers.push(timer);
      return;
    }
    cb(null, result.response);
  });

  const socket = {
    timeout: vi.fn((ms: number) => {
      (emit as any)._lastTimeoutMs = ms;
      return socket;
    }),
    emit,
  } as any;

  return socket;
}

describe('emitEventWithAck (unit, post-fix)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('U1: resolves with the real ack payload on a normal ACK', async () => {
    const socket = makeTimeoutAwareFakeSocket({
      onEmit: () => ({ response: { quizMaxNum: 3, isLast: false } }),
    });

    const promise = emitEventWithAck(socket, 'show quiz', { pinCode: '111111' });

    await expect(promise).resolves.toEqual({ quizMaxNum: 3, isLast: false });
    expect(socket.timeout).toHaveBeenCalledWith(DEFAULT_ACK_TIMEOUT_MS);
  });

  it('U2: rejects (does not hang forever) once the ack timeout elapses with no ACK', async () => {
    const socket = makeTimeoutAwareFakeSocket({
      onEmit: () => 'never',
    });

    const promise = emitEventWithAck(socket, 'show quiz', { pinCode: '111111' }, 3000);
    let settled = false;
    let rejected = false;
    promise.then(
      () => (settled = true),
      () => {
        settled = true;
        rejected = true;
      },
    );

    await vi.advanceTimersByTimeAsync(2999);
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toBe(true);
    expect(rejected).toBe(true);
  });

  it('U3: rejects on a real error ACK instead of resolving with it as success data', async () => {
    const socket = makeTimeoutAwareFakeSocket({
      onEmit: () => ({ response: undefined }),
    });

    const promise = emitEventWithAck(socket, 'session', { pinCode: '111111' });

    await expect(promise).rejects.toThrow('"session" event emit failed');
  });
});
