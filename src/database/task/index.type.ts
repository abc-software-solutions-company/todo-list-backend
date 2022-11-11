import { IAttachmentCreate, IAttachmentUpdate } from '../attachment/index.type';
import { ICommentCreate, ICommentUpdate } from '../comment/index.type';

export interface IAttachment {
  create?: Omit<IAttachmentCreate, 'taskId' | 'userId'>;
  update?: Omit<IAttachmentUpdate, 'taskId' | 'userId'>;
}

export interface IComment {
  create?: Omit<ICommentCreate, 'taskId' | 'userId'>;
  update?: Omit<ICommentUpdate, 'taskId' | 'userId'>;
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
  attachment?: IAttachment;
  comment?: IComment;
  storyPoint?: string;
  priority?: string;
  isActive?: boolean;
  isDone?: boolean;
  statusId: number;
  userId: string;
}

export interface ITaskReindex {
  taskFirstId: string;
  taskSecondId: string;
  taskReorderId: string;
  userId: string;
}
