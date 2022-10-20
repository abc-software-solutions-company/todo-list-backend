export interface IInit {
  todoListId: string;
}
export interface ICreate extends IInit {
  name: string;
}

export interface IUpdate extends ICreate {
  id: number;
}
