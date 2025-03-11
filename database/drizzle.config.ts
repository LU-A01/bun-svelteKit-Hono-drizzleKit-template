import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { resolve } from "path";

// プロジェクトルートの.envファイルを読み込む
dotenv.config({ path: resolve(__dirname, "../.env") });

export default defineConfig({
  schema: "./schema",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
