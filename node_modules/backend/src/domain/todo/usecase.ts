import type { CreateTodoDto, UpdateTodoDto } from '@shared/dto/todo';
import type { Todo } from './entity';

export interface TodoUseCase {
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | null>;
  createTodo(data: CreateTodoDto): Promise<Todo>;
  updateTodo(id: string, data: UpdateTodoDto): Promise<Todo | null>;
  deleteTodo(id: string): Promise<boolean>;
}
