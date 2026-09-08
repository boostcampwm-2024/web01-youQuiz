import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.E2E_CLIENT_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'e2e-report', open: 'never' }]],
  outputDir: 'e2e-results',
  use: {
    baseURL: BASE_URL,
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
    headless: process.env.HEADED ? false : true,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
