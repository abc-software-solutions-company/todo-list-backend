export interface ITaskImageCreate {
  taskId: string;

  imageId: number;
}

export interface ITaskImageUpdate extends ITaskImageCreate {
  isActive: boolean;
}
