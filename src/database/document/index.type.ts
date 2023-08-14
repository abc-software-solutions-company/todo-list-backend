export interface IDocumentCreate {
  name: string;
  content?: string;
  favorite?: number;
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
  favorite?: number;
  isActive?: boolean;
}
