import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { apiRoutes } from './presentation/routes/api.routes';

const app = new Hono();

// ミドルウェア
app.use('*', logger());

// CORSの設定を厳密に行う
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })
);

// ルート
app.get('/', (c) => c.text('Hono バックエンドサーバー'));

// API ルート
app.route('/api', apiRoutes);

// サーバー起動
const port = process.env.PORT || 3000;
console.log(`サーバーを起動しています: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
