export interface ITaskAttachmentCreate {
  taskId: string;

  attachmentId: number;
}

export interface ITaskAttachmentUpdate extends ITaskAttachmentCreate {
  isActive: boolean;
}
