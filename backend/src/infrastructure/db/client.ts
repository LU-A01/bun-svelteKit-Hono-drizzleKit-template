import * as fs from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@libsql/client';
import type { Client } from '@libsql/client';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { createTablesQuery } from './schema';

// プロジェクトルートの.envファイルを読み込む
const envPath = resolve(__dirname, '../../../../.env');
console.log(
  `環境変数ファイルパス: ${envPath} (存在: ${fs.existsSync(envPath) ? 'はい' : 'いいえ'})`
);
dotenv.config({ path: envPath });

// LibSQL接続設定の型定義
interface LibSQLConnectionConfig {
  url: string;
  authToken?: string;
}

// データベース接続とクライアントの初期化
let client: Client;
let db: LibSQLDatabase<typeof schema>;

try {
  // 環境変数からデータベース接続情報を取得
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  // 環境変数の内容を出力
  console.log('環境変数の内容:');
  console.log('DATABASE_URL =', process.env.DATABASE_URL);
  console.log('DATABASE_AUTH_TOKEN =', process.env.DATABASE_AUTH_TOKEN ? '設定済み' : '未設定');

  // URLがない場合はエラー
  if (!url) {
    throw new Error('DATABASE_URLが設定されていません');
  }

  // データベースの種類を検出
  const isTurso = url.startsWith('libsql://');
  const isSQLite = url.startsWith('file:') || url.startsWith('sqlite:');
  const isMemory = url === 'file::memory:';

  console.log('データベース接続情報:');
  console.log(
    `- タイプ: ${isTurso ? 'Turso' : isSQLite ? 'SQLite' : isMemory ? 'メモリ' : '不明'}`
  );
  console.log(`- URL: ${url}`);
  console.log(`- 認証トークン: ${authToken ? '設定済み' : '未設定'}`);

  // Tursoの場合は正確なURLを確認
  if (isTurso) {
    console.log('Tursoデータベース情報:');
    console.log(`- ホスト: ${url.replace('libsql://', '')}`);

    if (!authToken) {
      console.warn('警告: Tursoデータベースを使用していますが、認証トークンが設定されていません。');
    }
  }

  // 接続設定の作成
  const connectionConfig: LibSQLConnectionConfig = { url };

  // Tursoの場合は認証トークンを追加
  if (isTurso && authToken) {
    connectionConfig.authToken = authToken;
    console.log('認証トークンを設定しました');
  }

  // SQLiteファイルパスの場合は修正
  if (isSQLite && !isMemory && url.startsWith('sqlite:')) {
    // SQLiteファイルのパスを作成
    const dbName = url.replace('sqlite:', '');
    const dbPath = resolve(__dirname, '../../../../', dbName);
    console.log(`- SQLiteファイルパス: ${dbPath}`);
    connectionConfig.url = `file:${dbPath}`;
  }

  // LibSQLクライアントの作成
  console.log(
    '接続設定:',
    JSON.stringify(connectionConfig, (key, value) => (key === 'authToken' ? '***' : value))
  );
  client = createClient(connectionConfig);
  console.log('データベースクライアントを作成しました');

  // Drizzle ORMのインスタンスを作成
  db = drizzle(client, { schema });
  console.log('Drizzle ORMインスタンスを作成しました');

  // データベース接続テスト
  (async () => {
    try {
      console.log('データベース接続をテストしています...');
      const result = await client.execute('SELECT 1 as test');
      console.log('データベースに正常に接続しました!');
      console.log('テスト結果:', result.rows);
    } catch (error) {
      console.error('データベース接続エラー:', error);
      console.error('エラーの詳細:', (error as Error).message);
      console.error('スタックトレース:', (error as Error).stack);

      // エラーをログに出力するだけで、アプリケーションの実行は継続
      console.warn(
        '警告: データベースへの接続に問題がありますが、アプリケーションの実行を継続します。'
      );
    }
  })();
} catch (error) {
  console.error('データベース接続エラー:', error);
}

// データベース接続のエクスポート
export { db };
