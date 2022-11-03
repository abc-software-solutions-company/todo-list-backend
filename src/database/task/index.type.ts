export interface IGet {
  id: string;
}

export interface ICreate {
  name: string;
  description?: string;
  userId: string;
  todolistId: string;
}

export interface IUpdate extends IGet {
  name?: string;
  description?: string;
  attachments?: { add?: { name: string; link: string }; remove?: { id: number }; edit?: { id: number; name: string } };
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
