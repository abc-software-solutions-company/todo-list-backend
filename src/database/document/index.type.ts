export interface IDocumentCreate {
  name: string;
  content?: string;
  favorite?: boolean;
  parentId?: string;
  todolistId: string;
}
export interface IDocumentGet {
  id: string;
}
export interface IDocumentUpdate {
  id: string;
  name?: string;
  content?: string;
  favorite?: boolean;
  isActive?: boolean;
}
