export interface INotificationGet {
  userId: string;
}

export interface INotificationCreate {
  content: string;
  link?: string;
  type?: "todolist" | "task";
  userId: string;
}
