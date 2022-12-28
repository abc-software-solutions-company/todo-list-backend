export interface ITodolistUserGet {
  ownerId: string;
  nameOfTodolist: string;
}

export interface ITodolistUserCreate {
  todolistId: string;
  ids: string[];
}
