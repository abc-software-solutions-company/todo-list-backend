export interface IAttachmentCreate {
  name: string;
  link: string;
  taskId: string;
  userId: string;
}

export interface IAttachmentUpdate {
  id: number;
  name?: string;
  link?: string;
  isActive?: boolean;
  taskId: string;
  userId: string;
}
