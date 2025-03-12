import type { CreateTodoDto, UpdateTodoDto } from '@shared/dto/todo';
import type { Todo } from '../../domain/todo/entity';
import type { TodoRepository } from '../../domain/todo/repository';
import type { TodoUseCase } from '../../domain/todo/usecase';
import { TodoMemoryRepository } from '../../infrastructure/repositories/todo-memory.repository';
import { TodoTursoRepository } from '../../infrastructure/repositories/todo-turso.repository';

export class TodoService implements TodoUseCase {
  private todoRepository: TodoRepository;

  constructor() {
    // Tursoリポジトリを使用する
    try {
      this.todoRepository = new TodoTursoRepository();
      console.log('TodoTursoRepositoryを使用します');
    } catch (error) {
      console.error(
        'Tursoリポジトリの初期化に失敗しました。フォールバックとしてメモリリポジトリを使用します:',
        error
      );
      try {
        this.todoRepository = new TodoMemoryRepository();
        console.log('TodoMemoryRepositoryを使用します（フォールバック）');
      } catch (fallbackError) {
        console.error('メモリリポジトリの初期化にも失敗しました:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // 全てのTODO取得
  async getAllTodos(): Promise<Todo[]> {
    try {
      return await this.todoRepository.findAll();
    } catch (error) {
      console.error('getAllTodos エラー:', error);
      throw error;
    }
  }

  // 特定のTODO取得
  async getTodoById(id: string): Promise<Todo | null> {
    try {
      return await this.todoRepository.findById(id);
    } catch (error) {
      console.error(`getTodoById(${id}) エラー:`, error);
      throw error;
    }
  }

  // TODOの作成
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    try {
      return await this.todoRepository.create(data);
    } catch (error) {
      console.error('createTodo エラー:', error);
      throw error;
    }
  }

  // TODOの更新
  async updateTodo(id: string, data: UpdateTodoDto): Promise<Todo | null> {
    try {
      return await this.todoRepository.update(id, data);
    } catch (error) {
      console.error(`updateTodo(${id}) エラー:`, error);
      throw error;
    }
  }

  // TODOの削除
  async deleteTodo(id: string): Promise<boolean> {
    try {
      return await this.todoRepository.delete(id);
    } catch (error) {
      console.error(`deleteTodo(${id}) エラー:`, error);
      throw error;
    }
  }
}
