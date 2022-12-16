export interface IStatusInit {
  todolistId: string;
}
export interface IStatusCreate extends IStatusInit {
  name: string;
}

export interface IStatusUpdate extends IStatusInit {
  id: number;
  name?: string;
  isActive?: boolean;
}
