import { v4 as uuidv4 } from "uuid";
import type { Todo } from "../../domain/todo/entity";
import type { TodoRepository } from "../../domain/todo/repository";
import type { CreateTodoDto, UpdateTodoDto } from "@shared/dto/todo";

// メモリ内にデータを保存するリポジトリ
export class TodoMemoryRepository implements TodoRepository {
  private todos: Todo[] = [];

  constructor() {
    // 初期データを追加
    this.todos.push(
      {
        id: "1",
        title: "メモリ用サンプルタスク1",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "メモリ用サンプルタスク2",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    console.log("メモリリポジトリを初期化しました");
  }

  async findAll(): Promise<Todo[]> {
    console.log("メモリからすべてのTODOを取得します", this.todos.length);
    return [...this.todos];
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    return todo ? { ...todo } : null;
  }

  async create(data: CreateTodoDto): Promise<Todo> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newTodo: Todo = {
      id,
      title: data.title,
      completed: data.completed || false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(newTodo);
    return { ...newTodo };
  }

  async update(id: string, data: UpdateTodoDto): Promise<Todo | null> {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTodo = {
      ...this.todos[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.todos[index] = updatedTodo;
    return { ...updatedTodo };
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    return this.todos.length !== initialLength;
  }
} 