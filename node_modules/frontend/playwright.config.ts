import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },

  testDir: 'e2e',
  testMatch: '**/*.test.ts',

  // テスト実行の並列数を設定
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // テスト実行時のローカル開発環境の都合に合わせて調整可能な設定
  timeout: 30000,

  use: {
    // すべてのリクエストをトレースに含める
    trace: 'on-first-retry',
    // スクリーンショットを失敗時に取得
    screenshot: 'only-on-failure',
  },

  // CI環境ですべての主要ブラウザでテストを実行
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 必要に応じて他のブラウザを追加
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // テスト結果のレポート設定
  reporter: process.env.CI ? 'github' : 'html',
});
