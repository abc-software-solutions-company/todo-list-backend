export interface ITaskUserGet {
  taskName: string;
  assignorId: string;
  reporterId: string;
}

export interface ITaskUserCreate {
  taskId: string;
  ids: string[];
}
