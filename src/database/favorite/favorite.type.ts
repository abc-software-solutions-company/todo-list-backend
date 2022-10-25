export interface IFavoriteCreate {
  userId: string;
  todolistId: string;
}
export interface IFavoriteUpdate extends IFavoriteCreate {
  isActive: boolean;
}
