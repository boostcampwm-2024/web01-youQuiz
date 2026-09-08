import { test, expect } from '@playwright/test';
import type { WebSocketRoute } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, SHORT_TIMELIMIT_QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker } from './support/redis';
import { getGameInfo, getQuizState } from './support/gameState';

// e04(BrowserContext.setOffline)와 달리, setOffline()이 이 환경에서 45초 대기 중
// 브라우저가 스스로 전체 페이지 재로드를 반복 시도하는 부작용이 실측되어(앱/HMR과
// 무관), 여기서는 routeWebSocket()으로 socket.io 연결만 끊고 복구한다. 서버
// 입장에서는 실제 전송계층 단절과 동일하게 관측된다(close 프레임 즉시 수신).
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

  // socket.io 연결만 가로채 실제 서버로 프록시하고, 이후 밖에서 직접 close()할 수
  // 있도록 라우트 핸들을 저장한다. onClose를 등록하지 않아야 Playwright 기본
  // forwarding(한쪽이 닫히면 반대쪽도 닫아 서버까지 close 프레임을 전달)이 유지된다.
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

    // 1. 참가자 소켓 연결만 끊는다 - 기존 연결을 직접 close()하고, 이후
    // 재연결 시도는 blocked=true라 라우트 핸들러가 즉시 다시 닫는다.
    expect(getGameInfo(pinCode)!.participantList[0].connection).toBe('ON');
    blocked = true;
    expect(currentServerRoute, '테스트 시작 시점에 활성 서버 라우트가 있어야 함').toBeTruthy();
    // 서버·페이지 양쪽을 모두 명시적으로 close한다(한쪽만 닫으면 반대쪽에
    // 전파되지 않는 것을 실측으로 확인했다).
    await Promise.all([
      currentServerRoute!.close({ code: 1006, reason: 'e2e: connection blocked' }),
      currentClientRoute?.close({ code: 1006, reason: 'e2e: connection blocked' }),
    ]);

    const off = await waitForParticipantConnection(pinCode, 'OFF', 10_000);
    console.log(`[timeline] 서버에서 참가자 OFF 관측: ${off.ok ? off.elapsedMs + 'ms' : 'timeout'}`);
    expect(off.ok).toBe(true);

    // 2. 주최자는 실제 UI 절차로 다음 문제 진행
    const nextQuizButton = hostPage.getByRole('button', { name: '다음 퀴즈' });
    await expect(nextQuizButton).toBeEnabled({ timeout: 20_000 });
    await nextQuizButton.click();
    const next = await waitForCurrentOrder(pinCode, 1, 15_000);
    expect(next.ok).toBe(true);
    await expect(hostPage.getByText(SHORT_TIMELIMIT_QUIZZES[1].content)).toBeVisible({
      timeout: 15_000,
    });

    // 3. 참가자 소켓 연결 복구 허용 (socket.io-client가 자체적으로 재시도)
    blocked = false;
    const on = await waitForParticipantConnection(pinCode, 'ON', 20_000);
    console.log(`[timeline] 연결 복구 시간: ${on.ok ? on.elapsedMs + 'ms' : 'timeout'}`);
    expect(on.ok).toBe(true);

    // 4. 참가자가 수동 새로고침 없이 최신 문제로 복구되는지 확인
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
