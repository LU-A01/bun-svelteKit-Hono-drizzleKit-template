import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import type { Todo } from "../../domain/todo/entity";
import type { TodoRepository } from "../../domain/todo/repository";
import type { CreateTodoDto, UpdateTodoDto } from "@shared/dto/todo";
import { db } from "../db/client";
import { todos } from "../db/schema";
import { type LibSQLDatabase } from "drizzle-orm/libsql";

export class TodoTursoRepository implements TodoRepository {
  constructor() {
    console.log("TodoTursoRepositoryを初期化しています...");
    if (!db) {
      throw new Error("データベース接続が初期化されていません");
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      console.log("Tursoデータベースからすべてのタスクを取得します");
      const result = await db.select().from(todos);
      console.log(`取得したタスク数: ${result.length}`);
      return result.map(this.mapToEntity);
    } catch (error) {
      console.error("データベースからのTODO取得エラー:", error);
      console.error("エラーの詳細:", (error as Error).message);
      console.error("スタックトレース:", (error as Error).stack);
      throw new Error("TODOの取得に失敗しました");
    }
  }

  async findById(id: string): Promise<Todo | null> {
    try {
      console.log(`Tursoデータベースから ID: ${id} のタスクを取得します`);
      const result = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
      console.log(`タスクの存在: ${result.length > 0 ? 'はい' : 'いいえ'}`);
      return result.length > 0 ? this.mapToEntity(result[0]) : null;
    } catch (error) {
      console.error(`ID: ${id} のTODO取得エラー:`, error);
      console.error("エラーの詳細:", (error as Error).message);
      throw new Error("TODOの取得に失敗しました");
    }
  }

  async create(data: CreateTodoDto): Promise<Todo> {
    try {
      console.log("Tursoデータベースに新しいタスクを作成します", data);
      const id = uuidv4();
      const now = new Date().toISOString();

      const newTodo = {
        id,
        title: data.title,
        completed: data.completed || false,
        createdAt: now,
        updatedAt: now,
      };

      console.log("Tursoデータベースに挿入するタスク:", newTodo);
      await db.insert(todos).values({
        id: newTodo.id,
        title: newTodo.title,
        completed: newTodo.completed,
        createdAt: newTodo.createdAt,
        updatedAt: newTodo.updatedAt,
      });

      console.log("タスクが正常に作成されました ID:", id);
      return newTodo;
    } catch (error) {
      console.error("TODO作成エラー:", error);
      console.error("エラーの詳細:", (error as Error).message);
      throw new Error("TODOの作成に失敗しました");
    }
  }

  async update(id: string, data: UpdateTodoDto): Promise<Todo | null> {
    try {
      console.log(`Tursoデータベースの ID: ${id} のタスクを更新します`, data);
      const todo = await this.findById(id);
      if (!todo) {
        console.log(`更新対象のタスク ID: ${id} が見つかりませんでした`);
        return null;
      }

      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      console.log("更新するデータ:", updatedData);
      await db.update(todos).set(updatedData).where(eq(todos.id, id));

      console.log(`タスク ID: ${id} が正常に更新されました`);
      return {
        ...todo,
        ...data,
        updatedAt: updatedData.updatedAt,
      };
    } catch (error) {
      console.error(`ID: ${id} のTODO更新エラー:`, error);
      console.error("エラーの詳細:", (error as Error).message);
      throw new Error("TODOの更新に失敗しました");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      console.log(`Tursoデータベースから ID: ${id} のタスクを削除します`);
      await db.delete(todos).where(eq(todos.id, id));
      console.log(`タスク ID: ${id} が正常に削除されました`);
      return true; // 削除が成功したと見なす
    } catch (error) {
      console.error(`ID: ${id} のTODO削除エラー:`, error);
      console.error("エラーの詳細:", (error as Error).message);
      throw new Error("TODOの削除に失敗しました");
    }
  }

  // データベースの結果をドメインエンティティにマッピング
  private mapToEntity(data: any): Todo {
    return {
      id: data.id,
      title: data.title,
      completed: Boolean(data.completed),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
