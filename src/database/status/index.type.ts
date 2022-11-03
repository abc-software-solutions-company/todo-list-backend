export interface IInit {
  todolistId: string;
}
export interface ICreate extends IInit {
  name: string;
}

export interface IUpdate extends ICreate {
  id: number;
}
