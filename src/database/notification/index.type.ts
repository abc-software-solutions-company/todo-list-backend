export interface INotificationCreate {
  content: string;
  link?: string;
  type?:
    | 'assigned'
    | 'assigned-myself'
    | 'comment'
    | 'deleted-task'
    | 'invited'
    | 'priority'
    | 'renameTask'
    | 'status'
    | 'unassigned'
    | 'unassigned-myself';
  before?: string;
  after?: string;
  recipientId: string;
  senderId: string;
}

export interface INotificationUpdate {
  id: number;
}
