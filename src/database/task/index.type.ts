import { TaskTypeEnum } from 'src/utils/constants';
import { IAttachmentCreate, IAttachmentUpdate } from '../attachment/index.type';
import { ICommentCreate, ICommentUpdate } from '../comment/index.type';
import { ITaskUserCreate } from '../task-user/index.type';

export interface ITaskGet {
  id: string;
}

export interface ITaskCreateHepler {
  todolistId: string;
  userId: string;
  statusId: number;
}

export interface ITaskCreate {
  name: string;
  taskSymbol?: string;
  description?: string;
  userId: string;
  todolistId: string;
  statusId: number;
  priority?: string;
}
export interface IAttachment {
  create?: Omit<IAttachmentCreate, 'taskId' | 'userId'>;
  update?: Omit<IAttachmentUpdate, 'taskId' | 'userId'>;
}

export interface IComment {
  create?: Omit<ICommentCreate, 'taskId' | 'userId'>;
  update?: Omit<ICommentUpdate, 'taskId' | 'userId'>;
}

export type IAssignee = Omit<ITaskUserCreate, 'taskId' | 'name'>;

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
  relatedIds?: string[];
  type?: TaskTypeEnum;
  isActive?: boolean;
  isFeature?: boolean;
  isDone?: boolean;
  statusId: number;
  userId: string;
  assignee: IAssignee;
  indexColumn?: number;
  resetIndexColumn?: boolean;
}

export interface ITaskReindexAll {
  todolistId: string;
}
