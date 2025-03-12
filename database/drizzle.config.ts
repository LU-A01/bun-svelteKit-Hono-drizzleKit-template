import { resolve } from 'node:path';
import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// プロジェクトルートの.envファイルを読み込む
dotenv.config({ path: resolve(__dirname, '../.env') });

export default defineConfig({
  schema: './schema',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
