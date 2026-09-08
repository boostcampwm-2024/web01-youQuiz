import { test, expect } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker, redisGetJSON } from './support/redis';
import { QuizState } from './support/gameState';

const GUEST_NICKNAME = 'E2E참가자';

test('E01: 주최자 방 생성 → 참가자 입장 → 퀴즈 시작 → 답안 제출', async ({ browser }) => {
  const session = await createSession(browser);
  const { hostPage, guestPage } = session;
  const redis = new RedisTracker();
  let classId: number | undefined;

  try {
    const seed = await seedQuizClass(QUIZZES, (id) => {
      classId = id;
    });
    const { title } = seed;

    await hostPage.goto('/quiz-list');
    const classItem = hostPage.locator('div', { hasText: title }).first();
    await expect(classItem).toBeVisible({ timeout: 15_000 });
    await classItem.getByRole('button', { name: '퀴즈 시작하기' }).click();

    await hostPage.waitForURL(/\/quiz\/wait\/.+/, { timeout: 15_000 });
    const pinCode = hostPage.url().split('/quiz/wait/')[1];
    expect(pinCode).toMatch(/^[a-z0-9]{6}$/i);
    redis.track(
      `gameId=${pinCode}`,
      `gameId=${pinCode}:sid`,
      `gameId=${pinCode}:ranking`,
      `gameId=${pinCode}:quizId=0`,
    );

    await guestPage.goto(`/nickname/${pinCode}`);
    await guestPage.getByPlaceholder('Your Name').fill(GUEST_NICKNAME);
    await guestPage.getByRole('button', { name: '참가하기' }).click();
    await guestPage.waitForURL(/\/quiz\/wait\/.+/, { timeout: 15_000 });

    // Redis 정리 대상으로 이번 실행이 만든 sid를 추적
    const hostSid = (await session.hostContext.cookies()).find((c) => c.name === 'sid')?.value;
    const guestSid = (await session.guestContext.cookies()).find((c) => c.name === 'sid')?.value;
    redis.trackSid(hostSid);
    redis.trackSid(guestSid);
    if (hostSid) redis.track(`master_sid=${hostSid}`);
    if (guestSid) redis.track(`participant_sid=${guestSid}`);

    await expect(hostPage.getByText('1명')).toBeVisible({ timeout: 15_000 });
    await expect(hostPage.getByText(GUEST_NICKNAME)).toBeVisible();

    await hostPage.getByRole('button', { name: '퀴즈 시작하기' }).click();
    await hostPage.waitForURL(/\/quiz\/session\/host\/.+\/0/, { timeout: 15_000 });
    await guestPage.waitForURL(/\/quiz\/session\/.+\/1/, { timeout: 15_000 });

    await expect(hostPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });
    await expect(guestPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });

    const correctChoice = QUIZZES[0].choices.find((c) => c.isCorrect)!;
    await guestPage.getByRole('button', { name: new RegExp(correctChoice.content) }).click();
    await guestPage.getByRole('button', { name: '제출하기' }).click();
    await expect(guestPage.getByRole('button', { name: '제출 완료' })).toBeVisible({
      timeout: 15_000,
    });

    const totalSubmitCard = hostPage
      .locator('div', { has: hostPage.getByText('총 제출', { exact: true }) })
      .last();
    await expect(totalSubmitCard.getByText('1명', { exact: true })).toBeVisible({
      timeout: 15_000,
    });
    const solveRateCard = hostPage
      .locator('div', { has: hostPage.getByText('정답률', { exact: true }) })
      .last();
    await expect(solveRateCard.getByText('100%', { exact: true })).toBeVisible({
      timeout: 15_000,
    });

    // UI뿐 아니라 실제 서버(Redis) 상태로도 검증
    const gameStatus = redisGetJSON<QuizState>(`gameId=${pinCode}:quizId=0`);
    expect(gameStatus).toBeDefined();
    expect(gameStatus!.totalSubmit).toBe(1);
    expect(gameStatus!.totalCorrect).toBe(1);
  } finally {
    await session.close();
    await sleep(500); // 서버 disconnect 핸들러(비동기 Redis 갱신)가 끝날 시간을 준다
    if (classId !== undefined) {
      redis.track(`classId=${classId}`);
      await cleanupQuizClass(classId);
    }
    await redis.cleanup();
  }
});
