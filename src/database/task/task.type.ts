export interface IGet {
  todoListId: string;
}

export interface ICreate {
  name: string;
  userId: string;
  todoListId: string;
}

export interface IUpdate {
  id: string;
  name?: string;
  isActive?: boolean;
  isDone?: boolean;
}
