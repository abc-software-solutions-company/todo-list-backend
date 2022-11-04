import { IAttachmentCreate, IAttachmentUpdate } from '../attachment/index.type';
import { ICommentCreate, ICommentUpdate } from '../comment/index.type';

export interface IAttachments {
  create?: Omit<IAttachmentCreate, 'taskId'>;
  update?: Omit<IAttachmentUpdate, 'taskId'>;
}

export interface IComments {
  create?: Omit<ICommentCreate, 'taskId'>;
  update?: Omit<ICommentUpdate, 'taskId'>;
}

export interface ITaskGet {
  id: string;
}

export interface ITaskCreate {
  name: string;
  description?: string;
  userId: string;
  todolistId: string;
}

export interface ITaskUpdate extends ITaskGet {
  name?: string;
  description?: string;
  attachments?: IAttachments;
  comments?: IComments;
  statusId: number;
  isActive?: boolean;
  isDone?: boolean;
  userId: string;
}

export interface ITaskReindex {
  taskFirstId: string;
  taskSecondId: string;
  taskReorderId: string;
  userId: string;
}
