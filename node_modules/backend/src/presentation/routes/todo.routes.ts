import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateTodoSchema, UpdateTodoSchema } from "@shared/validation/todo";
import { TodoController } from "../controllers/todo.controller";
import { API_ENDPOINTS } from "@shared/constants/api";

export const todoRoutes = new Hono();
const todoController = new TodoController();

// TODO項目の一覧取得
todoRoutes.get("/", async (c) => {
  return todoController.getAllTodos(c);
});

// TODO項目の取得
todoRoutes.get("/:id", async (c) => {
  return todoController.getTodoById(c);
});

// TODO項目の作成
todoRoutes.post("/", zValidator("json", CreateTodoSchema), async (c) => {
  return todoController.createTodo(c);
});

// TODO項目の更新
todoRoutes.put("/:id", zValidator("json", UpdateTodoSchema), async (c) => {
  return todoController.updateTodo(c);
});

// TODO項目の削除
todoRoutes.delete("/:id", async (c) => {
  return todoController.deleteTodo(c);
});
