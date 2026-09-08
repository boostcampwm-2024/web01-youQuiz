import { test, expect } from '@playwright/test';
import { seedQuizClass, cleanupQuizClass, QUIZZES } from './support/seed';
import { createSession, sleep } from './support/session';
import { RedisTracker } from './support/redis';
import { getGameInfo, getQuizState, getParticipantCount } from './support/gameState';

const GUEST_NICKNAME = 'E2E참가자-새로고침';

test('E02: 참가자 새로고침 후 같은 게임/문제로 복구되고 제출이 정확히 1회 반영된다', async ({
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

    const hostSid = (await session.hostContext.cookies()).find((c) => c.name === 'sid')?.value;
    const guestSidBefore = (await session.guestContext.cookies()).find((c) => c.name === 'sid')
      ?.value;
    redis.trackSid(hostSid);
    redis.trackSid(guestSidBefore);
    if (hostSid) redis.track(`master_sid=${hostSid}`);
    if (guestSidBefore) redis.track(`participant_sid=${guestSidBefore}`);
    expect(guestSidBefore).toBeTruthy();

    await hostPage.getByRole('button', { name: '퀴즈 시작하기' }).click();
    await hostPage.waitForURL(/\/quiz\/session\/host\/.+\/0/, { timeout: 15_000 });
    await guestPage.waitForURL(/\/quiz\/session\/.+\/1/, { timeout: 15_000 });
    await expect(guestPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });

    const beforeGameInfo = getGameInfo(pinCode)!;
    const beforeQuizState = getQuizState(pinCode, 0)!;
    expect(beforeGameInfo.currentOrder).toBe(0);
    const participantCountBefore = getParticipantCount(pinCode);
    expect(participantCountBefore).toBe(1);

    await guestPage.reload();

    expect(guestPage.url()).toContain(`/quiz/session/${pinCode}/`);
    const guestSidAfter = (await session.guestContext.cookies()).find((c) => c.name === 'sid')
      ?.value;
    expect(guestSidAfter).toBe(guestSidBefore);

    await expect(guestPage.getByText(QUIZZES[0].content)).toBeVisible({ timeout: 15_000 });

    const afterGameInfo = getGameInfo(pinCode)!;
    expect(afterGameInfo.currentOrder).toBe(beforeGameInfo.currentOrder);
    const afterQuizState = getQuizState(pinCode, 0)!;
    expect(afterQuizState.startTime).toBe(beforeQuizState.startTime);
    expect(getParticipantCount(pinCode)).toBe(participantCountBefore);
    expect(afterGameInfo.participantList.filter((p) => p.position === 0).length).toBe(1);

    const correctChoice = QUIZZES[0].choices.find((c) => c.isCorrect)!;
    await guestPage.getByRole('button', { name: new RegExp(correctChoice.content) }).click();
    await guestPage.getByRole('button', { name: '제출하기' }).click();
    await expect(guestPage.getByRole('button', { name: '제출 완료' })).toBeVisible({
      timeout: 15_000,
    });

    // 새로고침으로 인한 중복 제출 없이 정확히 1회만 반영됐는지 확인
    const finalQuizState = getQuizState(pinCode, 0)!;
    expect(finalQuizState.totalSubmit).toBe(1);
    expect(finalQuizState.totalCorrect).toBe(1);

    const totalSubmitCard = hostPage
      .locator('div', { has: hostPage.getByText('총 제출', { exact: true }) })
      .last();
    await expect(totalSubmitCard.getByText('1명', { exact: true })).toBeVisible({
      timeout: 15_000,
    });
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
