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

export interface ITodolistUpdate {
  id: string;
  name?: string;
  isActive?: boolean;
  favorite: boolean;
  visibility?: string;
  userId: string;
}
