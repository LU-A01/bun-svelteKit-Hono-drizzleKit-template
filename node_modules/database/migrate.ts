import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

// プロジェクトルートの.envファイルを読み込む
dotenv.config({ path: resolve(__dirname, '../.env') });

// 環境変数から接続情報を取得
let url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

// データディレクトリの確認と作成
const dataDir = resolve(__dirname, 'data');
if (!existsSync(dataDir)) {
  console.log(`データディレクトリが存在しません。作成します: ${dataDir}`);
  mkdirSync(dataDir, { recursive: true });
}

// データベースの種類を検出
const isTurso = url?.startsWith('libsql://');
const isSQLite = url?.startsWith('file:') || url?.startsWith('sqlite:');

console.log('データベース接続情報:');
console.log(`- タイプ: ${isTurso ? 'Turso' : isSQLite ? 'SQLite' : '不明'}`);
console.log(`- 元のURL: ${url || 'なし'}`);
console.log(`- 認証トークン: ${authToken ? '設定済み' : '未設定'}`);

// LibSQL接続設定の型定義
interface LibSQLConnectionConfig {
  url: string;
  authToken?: string;
}

// SQLiteファイルパスの修正
if (isSQLite && url) {
  let dbPath = '';

  if (url.startsWith('sqlite:')) {
    // SQLiteファイルのパスを作成
    const dbName = url.replace('sqlite:', '');
    dbPath = resolve(__dirname, dbName);
  } else if (url.startsWith('file:')) {
    // file:から始まるURLの場合
    const dbName = url.replace('file:', '').replace('./', '');

    // ./で始まる相対パスの処理
    if (url.includes('./')) {
      dbPath = resolve(__dirname, dbName);
    } else {
      // 絶対パスまたは相対パスの処理
      if (dbName.startsWith('/')) {
        dbPath = dbName; // 絶対パス
      } else {
        // dev-test.dbのような単純なファイル名の場合はdataディレクトリに配置
        dbPath = resolve(dataDir, dbName);
      }
    }
  }

  // 最終的なURLを設定
  url = `file:${dbPath}`;
  console.log(`- 解決されたパス: ${dbPath}`);
  console.log(`- 最終的なURL: ${url}`);

  // パス情報を出力（デバッグ用）
  console.log('データディレクトリパス:', dataDir);
}

if (!url) {
  throw new Error('DATABASE_URLが設定されていません');
}

async function runMigration() {
  try {
    console.log('マイグレーションを開始します...');

    // 接続設定の作成
    const connectionConfig: LibSQLConnectionConfig = { url: url as string };

    // Tursoの場合は認証トークンを追加
    if (isTurso && authToken) {
      connectionConfig.authToken = authToken;
    }

    // LibSQLクライアントの作成
    const client = createClient(connectionConfig);

    // 接続テスト
    try {
      console.log('データベース接続をテストしています...');
      const result = await client.execute('SELECT 1');
      console.log('データベースに正常に接続しました!');
    } catch (error) {
      console.error('データベース接続エラー:', error);
      throw new Error('データベースへの接続に失敗しました');
    }

    // Drizzle ORMのインスタンスを作成
    const db = drizzle(client);

    // マイグレーションの実行
    console.log('マイグレーションを実行しています...');
    await migrate(db, { migrationsFolder: resolve(__dirname, 'migrations') });
    console.log('マイグレーション完了！');

    process.exit(0);
  } catch (error) {
    console.error('マイグレーションエラー:', error);
    process.exit(1);
  }
}

runMigration();
