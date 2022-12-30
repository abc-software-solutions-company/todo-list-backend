export interface ITaskUserGet {
  taskName: string;
  someoneId: string;
  reporterId: string;
}

export interface ITaskUserCreate {
  taskId: string;
  ids: string[];
}
