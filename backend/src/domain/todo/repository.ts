import type { Todo } from "./entity";
import type { CreateTodoDto, UpdateTodoDto } from "@shared/dto/todo";

export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(data: CreateTodoDto): Promise<Todo>;
  update(id: string, data: UpdateTodoDto): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
