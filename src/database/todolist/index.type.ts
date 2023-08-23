import { ApiProperty } from '@nestjs/swagger';
import { ITodolistUserCreate } from '../todolist-user/index.type';

export interface ITodolistSeoOne {
  id: string;
}

export interface ITodolistGetOne extends ITodolistSeoOne {
  userId?: string;
}

export interface ITodolistGetByUser {
  userId: string;
}

export type ITodolistGetFavorite = ITodolistGetByUser;

export interface ITodolistCreate extends ITodolistGetByUser {
  name: string;
  taskSymbol?: string;
  email?: string;
  visibility?: string;
  member?: ITodolistMember;
}
export type ITodolistMember = Omit<ITodolistUserCreate, 'todolistId'>;

export interface ITodolistUpdate {
  id: string;
  userId: string;
  name?: string;
  taskSymbol?: string;
  isActive?: boolean;
  favorite?: boolean;
  visibility?: string;
  member?: ITodolistMember;
  statusId?: number;
  statusIndex?: number;
  resetIndexStatus?: boolean;
  resetIndexTask?: boolean;
}

export interface ITodolistSync {
  email: string;
  name: string;
  userId: string;
}
export class ReindexAllDto {
  @ApiProperty({ example: 'taskFirstId' })
  todolistId: string;
}

export interface ISeedListTask {
  id: string;
  quantity: number;
  wordCount: number;
  userId: string;
}

export interface ISeedListDoc {
  id: string;
  quantityParentDoc: number;
  docNameLength: number;
  docContentLength: number;
  userId: string;
}
