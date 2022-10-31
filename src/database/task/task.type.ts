export interface IGet {
  id: string;
}

export interface ICreate {
  name: string;
  description?: string;
  userId: string;
  todoListId: string;
}

export interface IUpdate extends IGet {
  name?: string;
  description?: string;
  images?: { add?: string[]; remove?: number[] };
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
