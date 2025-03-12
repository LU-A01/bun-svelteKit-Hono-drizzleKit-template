// zod-v3.24.2およびhono-v4.7.4では以下のエラーが出るが、実行には支障がない
// 型 'ZodObject<{ title: ZodString; completed: ZodDefault<ZodBoolean>; }, "strip", ZodTypeAny, { title: string; completed: boolean; }, { title: string; completed?: boolean | undefined; }>' の引数を型 'ZodType<any, ZodTypeDef, any>' のパラメーターに割り当てることはできません。
// 型 'ZodObject<{ title: ZodString; completed: ZodDefault<ZodBoolean>; }, "strip", ZodTypeAny, { title: string; completed: boolean; }, { title: string; completed?: boolean | undefined; }>' には 型 'ZodType<any, ZodTypeDef, any>' からの次のプロパティがありません: "~standard", "~validate"

import { zValidator } from '@hono/zod-validator';
import { API_ENDPOINTS } from '@shared/constants/api';
import { CreateTodoSchema, UpdateTodoSchema } from '@shared/validation/todo';
import { Hono } from 'hono';
import { TodoController } from '../controllers/todo.controller';

export const todoRoutes = new Hono();
const todoController = new TodoController();

// TODO項目の一覧取得
todoRoutes.get('/', async (c) => {
  return todoController.getAllTodos(c);
});

// TODO項目の取得
todoRoutes.get('/:id', async (c) => {
  return todoController.getTodoById(c);
});

// TODO項目の作成
todoRoutes.post('/', zValidator('json', CreateTodoSchema), async (c) => {
  return todoController.createTodo(c);
});

// TODO項目の更新
todoRoutes.put('/:id', zValidator('json', UpdateTodoSchema), async (c) => {
  return todoController.updateTodo(c);
});

// TODO項目の削除
todoRoutes.delete('/:id', async (c) => {
  return todoController.deleteTodo(c);
});
