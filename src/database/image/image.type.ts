export interface IImageCreate {
  link: string;
}

export interface IImageUpdate {
  id: number;
  link?: string;
  isActive?: boolean;
}
