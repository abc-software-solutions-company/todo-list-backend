export interface IGet {
  id: string;
}

export interface ICreate {
  name: string;
  userId: string;
  todoListId: string;
}

export interface IUpdate extends IGet {
  name?: string;
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
