export interface ITodolistGetOne {
  id: string;
}

export interface ITodolistGetMyList {
  userId: string;
}

export interface ITodolistCreate extends ITodolistGetMyList {
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
