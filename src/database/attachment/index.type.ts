import { AttachmentType } from 'src/utils/constants';

export interface IAttachmentCreate {
  name: string;
  link: string;
  taskId: string;
  userId: string;
  type?: keyof typeof AttachmentType;
}

export interface IAttachmentUpdate {
  id: number;
  name?: string;
  link?: string;
  isActive?: boolean;
  taskId: string;
  userId: string;
  type?: keyof typeof AttachmentType;
}
