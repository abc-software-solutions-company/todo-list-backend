export interface IGet {
  todoListId: string;
}

export interface ICreate extends IGet {
  name: string;
  description?: string;
  userId: string;
}

export interface IUpdate {
  id: string;
  name?: string;
  description?: string;
  statusId: number;
  isActive?: boolean;
  isDone?: boolean;
  userId: string;
}

export interface IReIndex {
  taskFirstId: string;
  taskSecondId: string;
  taskReorderId: string;
  userId: string;
}
