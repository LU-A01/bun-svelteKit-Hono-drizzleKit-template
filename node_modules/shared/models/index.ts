// モデルのエクスポート
// 例: export interface Todo { id: string; title: string; completed: boolean; createdAt: Date; }

export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export * from './todo';
