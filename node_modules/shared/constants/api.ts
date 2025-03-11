// 環境変数からバックエンドのURLを取得
// Viteの環境変数アクセス方法 (フロントエンド用)
// @ts-ignore - Viteの型定義エラーの回避
const VITE_BACKEND_URL = typeof import.meta !== 'undefined' && 
  // @ts-ignore - import.meta.envはViteが提供する型で、TypeScriptのデフォルト型定義には含まれていない
  import.meta.env ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000' : undefined;

// Node.js環境変数アクセス方法 (バックエンド用)
const NODE_BACKEND_URL = typeof process !== 'undefined' && process.env 
  ? process.env.BACKEND_URL || 'http://localhost:3000'
  : undefined;

// いずれかの環境変数が存在する場合はそれを使用し、なければデフォルト値
export const API_BASE_URL = VITE_BACKEND_URL || NODE_BACKEND_URL || 'http://localhost:3000';

// APIのエンドポイントを定義
export const API_ENDPOINTS = {
  TODOS: `${API_BASE_URL}/api/todos`,
  TODO: (id: string) => `${API_BASE_URL}/api/todos/${id}`,
};
