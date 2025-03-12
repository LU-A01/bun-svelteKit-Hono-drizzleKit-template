import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { apiRoutes } from './presentation/routes/api.routes';

const app = new Hono();

// CORSの設定
// フロントエンドのURLを環境変数から取得
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
// CORS許可オリジンリストを環境変数から取得（カンマ区切り）
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : [];

// デフォルトの許可オリジンリスト（環境変数がない場合のフォールバック）
const defaultAllowedOrigins = [
  frontendUrl,
  // ローカル開発向けバリエーション
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Docker開発環境向け
  'http://frontend:5173',
];

// 両方のリストを結合して重複を削除
const allowedOrigins = [...new Set([...corsAllowedOrigins, ...defaultAllowedOrigins])];

console.log('CORS許可オリジン:', allowedOrigins);

// ミドルウェア
app.use('*', logger());

// CORSミドルウェアを使用
app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })
);

// ルート
app.get('/', (c) => c.text('Hono バックエンドサーバー'));

// ヘルスチェック
app.get('/health', (c) => {
  const healthInfo = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
  };

  return c.json(healthInfo);
});

// API ルート
app.route('/api', apiRoutes);

// サーバー起動
const port = process.env.PORT || 3000;
console.log(`サーバーを起動しています: http://localhost:${port}`);
console.log(`CORSを許可: ${allowedOrigins.join(', ')}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
