import { test, expect } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker } from './support/redis';
import { getGameInfo, getQuizState } from './support/gameState';

const GUEST_NICKNAME = 'E2E참가자-주최자새로고침';

test('E03: 주최자 새로고침 후 같은 게임의 주최자로 복구되고 currentOrder가 그대로 유지된다', async ({
  browser,
}) => {
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

    const hostSidBefore = (await session.hostContext.cookies()).find((c) => c.name === 'sid')
      ?.value;
    const guestSid = (await session.guestContext.cookies()).find((c) => c.name === 'sid')?.value;
    redis.trackSid(hostSidBefore);
    redis.trackSid(guestSid);
    if (hostSidBefore) redis.track(`master_sid=${hostSidBefore}`);
    if (guestSid) redis.track(`participant_sid=${guestSid}`);
    expect(hostSidBefore).toBeTruthy();

    await hostPage.getByRole('button', { name: '퀴즈 시작하기' }).click();
    await hostPage.waitForURL(/\/quiz\/session\/host\/.+\/0/, { timeout: 15_000 });
    await guestPage.waitForURL(/\/quiz\/session\/.+\/1/, { timeout: 15_000 });
    await expect(hostPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });

    const beforeGameInfo = getGameInfo(pinCode)!;
    const beforeQuizState = getQuizState(pinCode, 0)!;
    expect(beforeGameInfo.currentOrder).toBe(0);
    const participantCountBefore = beforeGameInfo.participantList.length;

    await hostPage.reload();

    expect(hostPage.url()).toContain(`/quiz/session/host/${pinCode}/`);
    const hostSidAfter = (await session.hostContext.cookies()).find((c) => c.name === 'sid')
      ?.value;
    expect(hostSidAfter).toBe(hostSidBefore);

    await expect(hostPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });
    await expect(guestPage.getByText(QUIZZES[0].content)).toBeVisible();

    // 'show quiz'는 조회 전용이므로 재조회 자체는 currentOrder를 바꾸지 않아야 한다
    const afterGameInfo = getGameInfo(pinCode)!;
    expect(afterGameInfo.currentOrder).toBe(beforeGameInfo.currentOrder);
    const afterQuizState = getQuizState(pinCode, 0)!;
    expect(afterQuizState.startTime).toBe(beforeQuizState.startTime);
    expect(afterGameInfo.participantList.length).toBe(participantCountBefore);

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

    const finalQuizState = getQuizState(pinCode, 0)!;
    expect(finalQuizState.totalSubmit).toBe(1);
    expect(finalQuizState.totalCorrect).toBe(1);
  } finally {
    await session.close();
    await sleep(500);
    if (classId !== undefined) {
      redis.track(`classId=${classId}`);
      await cleanupQuizClass(classId);
    }
    await redis.cleanup();
  }
});
