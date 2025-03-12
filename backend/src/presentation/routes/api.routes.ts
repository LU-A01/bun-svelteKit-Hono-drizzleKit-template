import { API_BASE_URL } from '@shared/constants/api';
import { Hono } from 'hono';
import { todoRoutes } from './todo.routes';

export const apiRoutes = new Hono();

apiRoutes.get('/', (c) => c.json({ message: 'API is running' }));

// ヘルスチェックエンドポイント
apiRoutes.get('/health', (c) => {
  // ヘルスチェック情報
  const healthInfo = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0'
  };
  
  return c.json(healthInfo);
});

// 各種APIルートをマウント
apiRoutes.route('/todos', todoRoutes);
