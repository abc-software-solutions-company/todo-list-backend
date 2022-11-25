import { IAttachmentCreate, IAttachmentUpdate } from '../attachment/index.type';
import { ICommentCreate, ICommentUpdate } from '../comment/index.type';
import { ITaskUserCreate } from '../task-user/index.type';

export interface ITaskGet {
  id: string;
}

export interface ITaskCreate {
  name: string;
  description?: string;
  userId: string;
  todolistId: string;
}
export interface IAttachment {
  create?: Omit<IAttachmentCreate, 'taskId' | 'userId'>;
  update?: Omit<IAttachmentUpdate, 'taskId' | 'userId'>;
}

export interface IComment {
  create?: Omit<ICommentCreate, 'taskId' | 'userId'>;
  update?: Omit<ICommentUpdate, 'taskId' | 'userId'>;
}

export type IAssignee = Omit<ITaskUserCreate, 'taskId'>;

export interface ITaskUpdate extends ITaskGet {
  name?: string;
  description?: string;
  index?: number;
  attachment?: IAttachment;
  comment?: IComment;
  storyPoint?: string;
  startDate?: Date;
  dueDate?: Date;
  priority?: string;
  isActive?: boolean;
  isDone?: boolean;
  statusId: number;
  userId: string;
  assignee: IAssignee;
}

export interface ITaskReindexAll {
  todolistId: string;
}
