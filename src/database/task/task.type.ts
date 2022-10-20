export interface IGet {
  todoListId: string;
}

export interface ICreate extends IGet {
  name: string;
  userId: string;
}

export interface IUpdate {
  id: string;
  name?: string;
  statusId: number;
  isActive?: boolean;
  isDone?: boolean;
}
