export interface ICommentCreate {
  comment: string;
  taskId: string;
  userId: string;
}

export interface ICommentUpdate {
  id: number;
  comment?: string;
  isActive?: boolean;
  taskId: string;
  userId: string;
}
