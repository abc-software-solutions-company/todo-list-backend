import { Status } from '../status/index.entity';
import { ITodolistUserCreate } from '../todolist-user/index.type';

export interface ITodolistSeoOne {
  id: string;
}

export interface ITodolistGetOne extends ITodolistSeoOne {
  userId: string;
}

export interface ITodolistGetByUser {
  userId: string;
}

export type ITodolistGetFavorite = ITodolistGetByUser;

export interface ITodolistCreate extends ITodolistGetByUser {
  name: string;
  email?: string;
}
export type ITodolistMember = Omit<ITodolistUserCreate, 'todolistId'>;

export interface ITodolistUpdate {
  id: string;
  userId: string;
  name?: string;
  isActive?: boolean;
  favorite?: boolean;
  visibility?: string;
  member?: ITodolistMember;
  statusId?: number;
  statusIndex?: number;
}

export interface ITodolistSync {
  email: string;
  name: string;
  userId: string;
}
