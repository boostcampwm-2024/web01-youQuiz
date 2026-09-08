import { test, expect } from '@playwright/test';
import type { WebSocketRoute } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, SHORT_TIMELIMIT_QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker } from './support/redis';
import { getGameInfo, getQuizState } from './support/gameState';

// e04는 setOffline()으로 네트워크 전체를 끊지만, 이 파일은 routeWebSocket()으로
// socket.io 연결만 끊어 같은 시나리오를 대안 방식으로 검증한다.
test('E04b(소켓 라우트 차단): 참가자 소켓 연결 차단 중 문제 진행 후 복구되면 새로고침 없이 최신 문제로 복구된다', async ({
  browser,
}) => {
  const session = await createSession(browser);
  const { hostPage, guestPage } = session;
  const redis = new RedisTracker();
  let classId: number | undefined;
  let pinCode: string | undefined;

  let blocked = false;
  let currentClientRoute: WebSocketRoute | undefined;
  let currentServerRoute: WebSocketRoute | undefined;
  let mainFrameNavigations = 0;
  guestPage.on('framenavigated', (frame) => {
    if (frame === guestPage.mainFrame()) {
      mainFrameNavigations += 1;
      console.log(`[diag] main frame navigated (#${mainFrameNavigations}): ${frame.url()}`);
    }
  });

  await session.guestContext.routeWebSocket('**/socket.io/**', (ws) => {
    if (blocked) {
      ws.close({ code: 1006, reason: 'e2e: connection blocked' });
      return;
    }
    currentClientRoute = ws;
    currentServerRoute = ws.connectToServer();
  });

  try {
    const seed = await seedQuizClass(SHORT_TIMELIMIT_QUIZZES, (id) => {
      classId = id;
    });
    const { title } = seed;

    await hostPage.goto('/quiz-list');
    const classItem = hostPage.locator('div', { hasText: title }).first();
    await expect(classItem).toBeVisible({ timeout: 15_000 });
    await classItem.getByRole('button', { name: '퀴즈 시작하기' }).click();
    await hostPage.waitForURL(/\/quiz\/wait\/.+/, { timeout: 15_000 });
    pinCode = hostPage.url().split('/quiz/wait/')[1];
    redis.track(
      `gameId=${pinCode}`,
      `gameId=${pinCode}:sid`,
      `gameId=${pinCode}:ranking`,
      `gameId=${pinCode}:quizId=0`,
      `gameId=${pinCode}:quizId=1`,
    );

    await guestPage.goto(`/nickname/${pinCode}`);
    await guestPage.getByPlaceholder('Your Name').fill('E2E참가자-소켓차단');
    await guestPage.getByRole('button', { name: '참가하기' }).click();
    await guestPage.waitForURL(/\/quiz\/wait\/.+/, { timeout: 15_000 });

    const hostSid = (await session.hostContext.cookies()).find((c) => c.name === 'sid')?.value;
    const guestSid = (await session.guestContext.cookies()).find((c) => c.name === 'sid')?.value;
    redis.trackSid(hostSid);
    redis.trackSid(guestSid);
    if (hostSid) redis.track(`master_sid=${hostSid}`);
    if (guestSid) redis.track(`participant_sid=${guestSid}`);

    await hostPage.getByRole('button', { name: '퀴즈 시작하기' }).click();
    await hostPage.waitForURL(/\/quiz\/session\/host\/.+\/0/, { timeout: 15_000 });
    await guestPage.waitForURL(/\/quiz\/session\/.+\/1/, { timeout: 15_000 });
    await expect(guestPage.getByText(SHORT_TIMELIMIT_QUIZZES[0].content)).toBeVisible({
      timeout: 15_000,
    });
    const participantCountBefore = getGameInfo(pinCode)!.participantList.length;

    mainFrameNavigations = 0;

    expect(getGameInfo(pinCode)!.participantList[0].connection).toBe('ON');
    blocked = true;
    expect(currentServerRoute).toBeTruthy();
    await Promise.all([
      currentServerRoute!.close({ code: 1006, reason: 'e2e: connection blocked' }),
      currentClientRoute?.close({ code: 1006, reason: 'e2e: connection blocked' }),
    ]);

    const off = await waitForParticipantConnection(pinCode, 'OFF', 10_000);
    console.log(`[timeline] 서버에서 참가자 OFF 관측: ${off.ok ? off.elapsedMs + 'ms' : 'timeout'}`);
    expect(off.ok).toBe(true);

    const nextQuizButton = hostPage.getByRole('button', { name: '다음 퀴즈' });
    await expect(nextQuizButton).toBeEnabled({ timeout: 20_000 });
    await nextQuizButton.click();
    const next = await waitForCurrentOrder(pinCode, 1, 15_000);
    expect(next.ok).toBe(true);
    await expect(hostPage.getByText(SHORT_TIMELIMIT_QUIZZES[1].content)).toBeVisible({
      timeout: 15_000,
    });

    blocked = false;
    const on = await waitForParticipantConnection(pinCode, 'ON', 20_000);
    console.log(`[timeline] 연결 복구 시간: ${on.ok ? on.elapsedMs + 'ms' : 'timeout'}`);
    expect(on.ok).toBe(true);

    const screenRecoverStart = Date.now();
    await expect(guestPage.getByText(SHORT_TIMELIMIT_QUIZZES[1].content)).toBeVisible({
      timeout: 15_000,
    });
    console.log(`[timeline] 화면 복구 시간: ${Date.now() - screenRecoverStart}ms`);
    console.log(`[diag] 재접속 구간 main frame navigation 횟수: ${mainFrameNavigations}`);

    const guestSidAfter = (await session.guestContext.cookies()).find((c) => c.name === 'sid')
      ?.value;
    expect(guestSidAfter).toBe(guestSid);
    expect(getGameInfo(pinCode)!.participantList.length).toBe(participantCountBefore);

    const correctChoice = SHORT_TIMELIMIT_QUIZZES[1].choices.find((c) => c.isCorrect)!;
    await guestPage.getByRole('button', { name: new RegExp(correctChoice.content) }).click();
    await guestPage.getByRole('button', { name: '제출하기' }).click();
    await expect(guestPage.getByRole('button', { name: '제출 완료' })).toBeVisible({
      timeout: 15_000,
    });

    const q2State = getQuizState(pinCode, 1)!;
    expect(q2State.totalSubmit).toBe(1);
    expect(q2State.totalCorrect).toBe(1);
  } finally {
    let cleanupError: unknown;
    try {
      await session.close();
      if (pinCode) {
        const settled = await waitForParticipantConnection(pinCode, 'OFF', 10_000);
        console.log(`[cleanup] disconnect 처리 완료 확인: ${settled.ok ? settled.elapsedMs + 'ms' : 'timeout'}`);
      }
      if (classId !== undefined) {
        redis.track(`classId=${classId}`);
        await cleanupQuizClass(classId);
      }
      await redis.cleanup();
    } catch (err) {
      cleanupError = err;
      console.log(`[cleanup] cleanup 중 오류: ${err}`);
    }
    if (cleanupError) throw new Error(`cleanup 실패: ${cleanupError}`);
  }
});

async function waitForParticipantConnection(
  pinCode: string,
  expected: 'ON' | 'OFF',
  timeoutMs: number,
): Promise<{ ok: boolean; elapsedMs: number }> {
  const start = Date.now();
  const deadline = start + timeoutMs;
  while (Date.now() < deadline) {
    const info = getGameInfo(pinCode);
    if (info?.participantList[0]?.connection === expected) {
      return { ok: true, elapsedMs: Date.now() - start };
    }
    await sleep(200);
  }
  return { ok: false, elapsedMs: Date.now() - start };
}

async function waitForCurrentOrder(
  pinCode: string,
  expected: number,
  timeoutMs: number,
): Promise<{ ok: boolean; elapsedMs: number }> {
  const start = Date.now();
  const deadline = start + timeoutMs;
  while (Date.now() < deadline) {
    if (getGameInfo(pinCode)?.currentOrder === expected) {
      return { ok: true, elapsedMs: Date.now() - start };
    }
    await sleep(200);
  }
  return { ok: false, elapsedMs: Date.now() - start };
}
