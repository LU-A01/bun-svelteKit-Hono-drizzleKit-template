import type { Todo } from "./entity";
import type { CreateTodoDto, UpdateTodoDto } from "@shared/dto/todo";

export interface TodoUseCase {
  getAllTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | null>;
  createTodo(data: CreateTodoDto): Promise<Todo>;
  updateTodo(id: string, data: UpdateTodoDto): Promise<Todo | null>;
  deleteTodo(id: string): Promise<boolean>;
}
