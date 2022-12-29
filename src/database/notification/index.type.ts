export interface INotificationCreate {
  content: string;
  link?: string;
  type?: 'invited' | 'assigned' | 'status' | 'priority' | 'comment' | 'deletedTask' | 'renameTask';
  before?: string;
  after?: string;
  recipientId: string;
  senderId: string;
}

export interface INotificationUpdate {
  id: number;
}
