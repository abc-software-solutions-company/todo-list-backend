export interface IImageCreate {
  name: string;
  link: string;
}

export interface IImageUpdate {
  id: number;
  name?: string;
  link?: string;
  isActive?: boolean;
}
