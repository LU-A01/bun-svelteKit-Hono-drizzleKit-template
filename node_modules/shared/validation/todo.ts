import { z } from 'zod';
import { IdSchema } from './index';

export const TodoSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().default(false),
});

export const UpdateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});
