import { Browser, BrowserContext, Page } from '@playwright/test';

export interface Session {
  hostContext: BrowserContext;
  guestContext: BrowserContext;
  hostPage: Page;
  guestPage: Page;
  close(): Promise<void>;
}

// 각 테스트가 독립된 주최자·참가자 BrowserContext(별도 쿠키/스토리지)로
// 시작하도록 만드는 헬퍼. 같은 컨텍스트의 탭 두 개로 대체하지 않는다.
export async function createSession(browser: Browser): Promise<Session> {
  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext();
  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();

  return {
    hostContext,
    guestContext,
    hostPage,
    guestPage,
    async close() {
      await hostContext.close();
      await guestContext.close();
    },
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
