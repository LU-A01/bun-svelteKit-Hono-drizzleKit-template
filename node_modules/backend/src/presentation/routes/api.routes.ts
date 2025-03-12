import { API_BASE_URL } from '@shared/constants/api';
import { Hono } from 'hono';
import { todoRoutes } from './todo.routes';

export const apiRoutes = new Hono();

apiRoutes.get('/', (c) => c.json({ message: 'API is running' }));

// 各種APIルートをマウント
apiRoutes.route('/todos', todoRoutes);
