import type { BaseDto } from './index';

export interface TodoDto extends BaseDto {
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}
