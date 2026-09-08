import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getQuizSessionQueryOptions } from './useQuizSession';
import { createAppQueryClient } from '@/shared/config/queryClient';

// 실제 queryFn + 재시도 정책을 QueryClient.fetchQuery로 직접 검증(React 렌더 불필요)
function makeControllableFakeSocket() {
  const emitCalls: any[] = [];
  let lastTimeoutMs = 0;
  const script: Array<'never' | { response: any } | { err: Error }> = [];
  let scriptIndex = 0;
  const pendingTimers: NodeJS.Timeout[] = [];

  const socket = {
    timeout: vi.fn((ms: number) => {
      lastTimeoutMs = ms;
      return socket;
    }),
    emit: vi.fn((event: string, data: any, cb: (err: Error | null, res?: any) => void) => {
      emitCalls.push({ event, data, ms: lastTimeoutMs });
      const step = script[scriptIndex] ?? 'never';
      scriptIndex += 1;
      if (step === 'never') {
        pendingTimers.push(setTimeout(() => cb(new Error('operation has timed out')), lastTimeoutMs));
      } else if ('err' in step) {
        cb(step.err);
      } else {
        cb(null, step.response);
      }
    }),
  } as any;

  return {
    socket,
    script,
    emitCalls,
    cleanup: () => pendingTimers.forEach(clearTimeout),
  };
}

describe('useQuizSession query integration (Q1-Q4)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('Q1: first ACK misses, single retry succeeds -> 2 attempts, final data is the success response', async () => {
    const { socket, script, emitCalls, cleanup } = makeControllableFakeSocket();
    script.push('never', { response: { quizMaxNum: 5, isLast: false, attempt: 2 } });

    const queryClient = createAppQueryClient();
    const options = getQuizSessionQueryOptions({ socket, pinCode: '123456', quizOrder: 0 });

    const promise = queryClient.fetchQuery(options);
    await vi.advanceTimersByTimeAsync(3000); // 1차 타임아웃
    await vi.advanceTimersByTimeAsync(500); // 재시도 지연
    await vi.runAllTimersAsync();

    const data = await promise;
    expect(data).toEqual({ quizMaxNum: 5, isLast: false, attempt: 2 });
    expect(emitCalls).toHaveLength(2);

    cleanup();
    queryClient.clear();
  });

  it('Q2: both ACKs miss -> exactly 2 attempts total, query ends in error state', async () => {
    const { socket, script, emitCalls, cleanup } = makeControllableFakeSocket();
    script.push('never', 'never');

    const queryClient = createAppQueryClient();
    const options = getQuizSessionQueryOptions({ socket, pinCode: '123456', quizOrder: 0 });

    const settledResult = queryClient.fetchQuery(options).then(
      (data) => ({ status: 'success' as const, data }),
      (error) => ({ status: 'error' as const, error }),
    );

    await vi.advanceTimersByTimeAsync(3000); // 1차 타임아웃
    await vi.advanceTimersByTimeAsync(500); // 재시도 지연
    await vi.advanceTimersByTimeAsync(3000); // 2차 타임아웃
    await vi.runAllTimersAsync();

    const result = await settledResult;
    expect(result.status).toBe('error');
    expect(emitCalls).toHaveLength(2); // retry:1 → 총 2회

    cleanup();
    queryClient.clear();
  });

  it('Q3: a state-changing, one-shot ack call (e.g. "session") is never wrapped in a query retry', async () => {
    // "session"(정원 초과 시 undefined ACK)은 Query가 아닌 emitEventWithAck를
    // 직접 호출(nickname/index.tsx)하므로 재시도 계층 자체가 없음을 확인
    const { socket, script, emitCalls, cleanup } = makeControllableFakeSocket();
    script.push({ response: undefined });

    const { emitEventWithAck } = await import('@/shared/utils/emitEventWithAck');
    const result = await emitEventWithAck(socket, 'session', { pinCode: '123456' }).then(
      (data) => ({ status: 'success' as const, data }),
      (error) => ({ status: 'error' as const, error }),
    );

    expect(result.status).toBe('error');
    expect(emitCalls).toHaveLength(1); 

    cleanup();
  });

  it('Q4: late ACK from the first (failed) attempt does not clobber the retry-derived cache', async () => {
    const { socket, script, emitCalls, cleanup } = makeControllableFakeSocket();
    script.push('never', { response: { quizMaxNum: 9, isLast: true, attempt: 2 } });

    const queryClient = createAppQueryClient();
    const options = getQuizSessionQueryOptions({ socket, pinCode: '123456', quizOrder: 0 });

    const promise = queryClient.fetchQuery(options);
    await vi.advanceTimersByTimeAsync(3000);
    await vi.advanceTimersByTimeAsync(500);
    await vi.runAllTimersAsync();
    const data = await promise;

    expect(data).toEqual({ quizMaxNum: 9, isLast: true, attempt: 2 });
    expect(emitCalls).toHaveLength(2);

    const cached = queryClient.getQueryData(options.queryKey);
    expect(cached).toEqual({ quizMaxNum: 9, isLast: true, attempt: 2 });

    cleanup();
    queryClient.clear();
  });
});
