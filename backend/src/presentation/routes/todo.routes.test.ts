import { describe, it, expect, vi, beforeEach } from 'vitest';
import { todoRoutes } from './todo.routes';
import { TodoController } from '../controllers/todo.controller';

// TodoControllerをモック化
vi.mock('../controllers/todo.controller', () => {
  const mockController = {
    getAllTodos: vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { id: '1', title: 'テストTodo', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ]), { status: 200, headers: { 'Content-Type': 'application/json' } })),
    
    getTodoById: vi.fn().mockResolvedValue(new Response(JSON.stringify(
      { id: '1', title: 'テストTodo', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01' }
    ), { status: 200, headers: { 'Content-Type': 'application/json' } })),
    
    createTodo: vi.fn().mockResolvedValue(new Response(JSON.stringify(
      { id: '2', title: '新しいTodo', completed: false, createdAt: '2023-01-02', updatedAt: '2023-01-02' }
    ), { status: 201, headers: { 'Content-Type': 'application/json' } })),
    
    updateTodo: vi.fn().mockResolvedValue(new Response(JSON.stringify(
      { id: '1', title: '更新されたTodo', completed: true, createdAt: '2023-01-01', updatedAt: '2023-01-03' }
    ), { status: 200, headers: { 'Content-Type': 'application/json' } })),
    
    deleteTodo: vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  };

  return {
    TodoController: vi.fn().mockImplementation(() => mockController)
  };
});

describe('Todo Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all todos', async () => {
    // 正しいURLパスでリクエストを作成
    const req = new Request('http://localhost/');
    const res = await todoRoutes.fetch(req);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].title).toBe('テストTodo');
  });

  it('should get a todo by id', async () => {
    // 正しいURLパスでリクエストを作成
    const req = new Request('http://localhost/1');
    const res = await todoRoutes.fetch(req);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.id).toBe('1');
    expect(data.title).toBe('テストTodo');
  });

  it('should create a new todo', async () => {
    // 正しいURLパスでリクエストを作成
    const req = new Request('http://localhost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: '新しいTodo' })
    });
    
    const res = await todoRoutes.fetch(req);
    
    expect(res.status).toBe(201);
    
    const data = await res.json();
    expect(data.id).toBe('2');
    expect(data.title).toBe('新しいTodo');
  });

  it('should update a todo', async () => {
    // 正しいURLパスでリクエストを作成
    const req = new Request('http://localhost/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: '更新されたTodo', completed: true })
    });
    
    const res = await todoRoutes.fetch(req);
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.id).toBe('1');
    expect(data.title).toBe('更新されたTodo');
    expect(data.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    // 正しいURLパスでリクエストを作成
    const req = new Request('http://localhost/1', {
      method: 'DELETE'
    });
    
    const res = await todoRoutes.fetch(req);
    
    expect(res.status).toBe(204);
  });
}); 