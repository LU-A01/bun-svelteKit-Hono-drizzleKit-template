import { describe, expect, it } from 'vitest';
import { apiRoutes } from './api.routes';

describe('API Routes', () => {
  it('should return a message that API is running', async () => {
    // リクエストを作成
    const req = new Request('http://localhost/');

    // APIルートにリクエストを送信
    const res = await apiRoutes.fetch(req);

    // レスポンスのステータスコードを検証
    expect(res.status).toBe(200);

    // レスポンスのJSONを検証
    const data = await res.json();
    expect(data).toEqual({ message: 'API is running' });
  });
});
