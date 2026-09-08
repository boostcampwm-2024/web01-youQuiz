import { test, expect } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, SHORT_TIMELIMIT_QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker } from './support/redis';
import { getGameInfo, getQuizState } from './support/gameState';

const GUEST_NICKNAME = 'E2E참가자-재접속';

// socket.io 핸드셰이크의 pingInterval(25s)+pingTimeout(20s)=45s가 서버가
// 단절을 인지하기까지 걸리는 정상 상한이다. 여기에 여유를 둔 값을 사용한다.
const HEARTBEAT_TIMEOUT_MS = 45_000;
const HEARTBEAT_WAIT_BUDGET_MS = 58_000;

interface TimelineEntry {
  label: string;
  atMs: number;
}

function makeTimeline() {
  const start = Date.now();
  const entries: TimelineEntry[] = [];
  return {
    mark(label: string) {
      const atMs = Date.now() - start;
      entries.push({ label, atMs });
      console.log(`[timeline] +${atMs}ms ${label}`);
    },
    dump() {
      return entries;
    },
  };
}

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

// 단절 인지(최대 45s) + 다음 문제 전환 + 복구 후 제출까지 감안한 상한
test.setTimeout(150_000);

test('E04: 참가자 단절 중 문제 진행 후 재접속하면 새로고침 없이 최신 문제로 복구된다', async ({
  browser,
}) => {
  const session = await createSession(browser);
  const { hostPage, guestPage } = session;
  const redis = new RedisTracker();
  const timeline = makeTimeline();
  let classId: number | undefined;
  let pinCode: string | undefined;

  // 실제 전체 페이지 리로드(main frame navigation)가 있었는지 직접 관측
  let mainFrameNavigations = 0;
  guestPage.on('framenavigated', (frame) => {
    if (frame === guestPage.mainFrame()) {
      mainFrameNavigations += 1;
      console.log(`[diag] main frame navigated (#${mainFrameNavigations}): ${frame.url()}`);
    }
  });
  guestPage.on('load', () => console.log('[diag] page "load" event fired (new document loaded)'));
  guestPage.on('websocket', (ws) => {
    console.log(`[diag] websocket opened: ${ws.url()}`);
    ws.on('close', () => console.log(`[diag] websocket closed: ${ws.url()}`));
    ws.on('socketerror', (err) => console.log(`[diag] websocket error: ${err}`));
  });
  guestPage.on('pageerror', (err) => console.log(`[guest pageerror] ${err}`));
  guestPage.on('console', (msg) => console.log(`[guest console] ${msg.type()}: ${msg.text()}`));
  guestPage.on('request', (req) => {
    if (req.resourceType() === 'document') {
      console.log(
        `[diag] document request: ${req.method()} ${req.url()} (navigation=${req.isNavigationRequest()})`,
      );
    }
  });
  guestPage.on('requestfailed', (req) => {
    if (req.resourceType() === 'document') {
      console.log(`[diag] document request FAILED: ${req.url()} reason=${req.failure()?.errorText}`);
    }
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
    await guestPage.getByPlaceholder('Your Name').fill(GUEST_NICKNAME);
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

    // 이후 구간에서 실제로 몇 번 navigate 됐는지만 세기 위해 리셋
    mainFrameNavigations = 0;

    // 참가자 연결만 끊는다 (주최자는 계속 동작)
    const before = await waitForParticipantConnection(pinCode, 'ON', 5_000);
    expect(before.ok).toBe(true);
    timeline.mark('participant offline 설정 직전 (서버는 아직 ON)');
    await session.guestContext.setOffline(true);
    timeline.mark('participant offline 설정 완료 (도구 호출)');

    // 도구 호출 성공이 아니라 서버가 실제로 연결 해제를 관측했는지 폴링으로 확인
    const off = await waitForParticipantConnection(pinCode, 'OFF', HEARTBEAT_WAIT_BUDGET_MS);
    timeline.mark(`서버에서 참가자 OFF 관측 (${off.ok ? off.elapsedMs + 'ms' : 'timeout'})`);
    expect(off.ok).toBe(true);
    expect(
      off.elapsedMs,
      'heartbeat 타임아웃(45s) 대비 지나치게 빠른 단절 감지는 setOffline이 즉시 close를 보낸 것일 뿐 실제 대상 시나리오(네트워크 단절)와 다를 수 있음을 표시',
    ).toBeGreaterThan(0);

    // 주최자는 실제 UI 절차(제한시간 종료 후 "다음 퀴즈" 버튼)로 다음 문제 진행
    await hostPage.bringToFront();
    const nextQuizButton = hostPage.getByRole('button', { name: '다음 퀴즈' });
    await expect(nextQuizButton).toBeEnabled({ timeout: 20_000 });
    await nextQuizButton.click();

    const next = await waitForCurrentOrder(pinCode, 1, 15_000);
    timeline.mark(`서버 currentOrder=1 도달 (${next.ok ? next.elapsedMs + 'ms' : 'timeout'})`);
    expect(next.ok).toBe(true);
    await expect(hostPage.getByText(SHORT_TIMELIMIT_QUIZZES[1].content)).toBeVisible({
      timeout: 15_000,
    });

    timeline.mark('participant online 복구 직전');
    await session.guestContext.setOffline(false);
    timeline.mark('participant online 복구 완료 (도구 호출)');

    const on = await waitForParticipantConnection(pinCode, 'ON', HEARTBEAT_WAIT_BUDGET_MS);
    timeline.mark(`서버에서 참가자 ON 관측 = 연결 복구 시간 (${on.ok ? on.elapsedMs + 'ms' : 'timeout'})`);
    expect(on.ok).toBe(true);

    // 참가자가 수동 새로고침 없이 서버의 현재 문제(Q2)로 복구되는지 확인
    // (이 아래로 reload()/goto() 호출 없음)
    const screenRecoverStart = Date.now();
    await expect(guestPage.getByText(SHORT_TIMELIMIT_QUIZZES[1].content)).toBeVisible({
      timeout: 15_000,
    });
    timeline.mark(`참가자 화면에 현재 문제(Q2) 표시 = 화면 복구 시간 (${Date.now() - screenRecoverStart}ms)`);

    console.log(
      `[diag] 재접속 구간 동안 main frame navigation 횟수: ${mainFrameNavigations} ` +
        '(0이면 전체 페이지 리로드 없음, 1 이상이면 실제 문서 재로드가 있었다는 근거)',
    );

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
    timeline.mark('복구 후 답안 제출 완료');

    const q2State = getQuizState(pinCode, 1)!;
    expect(q2State.totalSubmit).toBe(1);
    expect(q2State.totalCorrect).toBe(1);
  } finally {
    let cleanupError: unknown;
    try {
      await session.guestContext.setOffline(false).catch(() => {});
      await session.close();

      // 서버 disconnect 처리 완료(connection:'OFF')를 폴링으로 확인 (실패해도 정리는 계속 진행)
      if (pinCode) {
        const disconnectSettled = await waitForParticipantConnection(pinCode, 'OFF', 10_000);
        console.log(
          `[cleanup] disconnect 처리 완료 확인: ${
            disconnectSettled.ok ? disconnectSettled.elapsedMs + 'ms' : '10s 안에 미확인 (정리는 계속 진행)'
          }`,
        );
      }

      if (classId !== undefined) {
        redis.track(`classId=${classId}`);
        await cleanupQuizClass(classId);
      }
      await redis.cleanup();
    } catch (err) {
      cleanupError = err;
      console.log(`[cleanup] cleanup 중 오류 발생 (테스트 자체 결과와 별개로 기록): ${err}`);
    }
    if (cleanupError) {
      throw new Error(`cleanup 실패(테스트 assertion과 무관): ${cleanupError}`);
    }
  }
});
