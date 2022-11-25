import { ITodolistUserCreate } from '../todolist-user/index.type';

export interface ITodolistGetOne {
  id: string;
}

export interface ITodolistGetByUser {
  userId: string;
}

export type ITodolistGetFavorite = ITodolistGetByUser;

export interface ITodolistCreate extends ITodolistGetByUser {
  name: string;
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
}

export interface ISyncTodolist {
  email: string;
  userId: string;
}
