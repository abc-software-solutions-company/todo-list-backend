export interface IGetOne {
  id: string;
}

export interface IGetMyList {
  userId: string;
}

export interface ICreate extends IGetMyList {
  name: string;
}

export interface IUpdate {
  id: string;
  name?: string;
  isActive?: boolean;
  visibility?: number;
  userId: string;
}
