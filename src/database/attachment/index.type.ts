export interface IAttachmentCreate {
  name: string;
  link: string;
}

export interface IAttachmentUpdate {
  id: number;
  name?: string;
  link?: string;
  isActive?: boolean;
}
