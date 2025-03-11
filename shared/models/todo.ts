import { BaseModel } from "./index";

// 基本的なTodoモデル（フロントエンド用）
export interface Todo extends Omit<BaseModel, "createdAt" | "updatedAt"> {
  title: string;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
