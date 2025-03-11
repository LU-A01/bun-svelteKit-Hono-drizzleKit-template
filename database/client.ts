import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

// 環境変数から接続情報を取得
const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  throw new Error("DATABASE_URLが設定されていません");
}

// LibSQLクライアントの作成
const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

// Drizzle ORMのインスタンスを作成
export const db = drizzle(client, { schema });
