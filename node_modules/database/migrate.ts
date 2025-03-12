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

// データベースの種類を検出
const isTurso = url?.startsWith('libsql://');
const isSQLite = url?.startsWith('file:') || url?.startsWith('sqlite:');

console.log('データベース接続情報:');
console.log(`- タイプ: ${isTurso ? 'Turso' : isSQLite ? 'SQLite' : '不明'}`);
console.log(`- URL: ${url || 'なし'}`);
console.log(`- 認証トークン: ${authToken ? '設定済み' : '未設定'}`);

// LibSQL接続設定の型定義
interface LibSQLConnectionConfig {
  url: string;
  authToken?: string;
}

// SQLiteファイルパスの修正
if (isSQLite && url && url.startsWith('sqlite:')) {
  // SQLiteファイルのパスを作成
  const dbName = url.replace('sqlite:', '');
  const dbDir = resolve(__dirname, '../');
  const dbPath = resolve(dbDir, dbName);

  // ファイルが存在するか確認
  console.log('データベースパス:', dbPath);

  // SQLiteの接続URLを設定
  url = `file:${dbPath}`;
}

if (!url) {
  throw new Error('DATABASE_URLが設定されていません');
}

console.log('Database URL:', url);

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
