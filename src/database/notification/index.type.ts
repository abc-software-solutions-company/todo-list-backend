export interface INotificationCreate {
  content: string;
  link?: string;
  type?: "todolist" | "task";
  recipientID: string;
  senderID: string;
}

export interface INotificationUpdate {
  id: number;
}
