// バリデーションスキーマのエクスポート
// 例: import { z } from 'zod'; export const TodoSchema = z.object({ title: z.string(), completed: z.boolean() });

import { z } from "zod";

export const IdSchema = z.string().uuid();

export * from "./todo";
