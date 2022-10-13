export interface IGetMyList {
  userId: string;
}

export interface ICreate {
  userId: string;
  name: string;
}

export interface IUpdate {
  id: string;
  name?: string;
  isActive?: boolean;
}
