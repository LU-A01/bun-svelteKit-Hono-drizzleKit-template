import type { Context } from 'hono';
import { TodoService } from '../../application/services/todo.service';
import type { TodoUseCase } from '../../domain/todo/usecase';

export class TodoController {
  private todoUseCase: TodoUseCase;

  constructor() {
    this.todoUseCase = new TodoService();
  }

  // 全てのTODO取得
  async getAllTodos(c: Context) {
    try {
      const todos = await this.todoUseCase.getAllTodos();
      return c.json(todos);
    } catch (error) {
      console.error('Error getting all todos:', error);
      return c.json({ error: 'TODOの取得に失敗しました' }, 500);
    }
  }

  // 特定のTODO取得
  async getTodoById(c: Context) {
    try {
      const id = c.req.param('id');
      const todo = await this.todoUseCase.getTodoById(id);

      if (!todo) {
        return c.json({ error: 'TODOが見つかりません' }, 404);
      }

      return c.json(todo);
    } catch (error) {
      console.error('Error getting todo by id:', error);
      return c.json({ error: 'TODOの取得に失敗しました' }, 500);
    }
  }

  // TODOの作成
  async createTodo(c: Context) {
    try {
      const data = await c.req.json();
      const todo = await this.todoUseCase.createTodo(data);
      return c.json(todo, 201);
    } catch (error) {
      console.error('Error creating todo:', error);
      return c.json({ error: 'TODOの作成に失敗しました' }, 500);
    }
  }

  // TODOの更新
  async updateTodo(c: Context) {
    try {
      const id = c.req.param('id');
      const data = await c.req.json();
      const todo = await this.todoUseCase.updateTodo(id, data);

      if (!todo) {
        return c.json({ error: 'TODOが見つかりません' }, 404);
      }

      return c.json(todo);
    } catch (error) {
      console.error('Error updating todo:', error);
      return c.json({ error: 'TODOの更新に失敗しました' }, 500);
    }
  }

  // TODOの削除
  async deleteTodo(c: Context) {
    try {
      const id = c.req.param('id');
      const success = await this.todoUseCase.deleteTodo(id);

      if (!success) {
        return c.json({ error: 'TODOが見つかりません' }, 404);
      }

      return c.json({ success: true }, 200);
    } catch (error) {
      console.error('Error deleting todo:', error);
      return c.json({ error: 'TODOの削除に失敗しました' }, 500);
    }
  }
}
