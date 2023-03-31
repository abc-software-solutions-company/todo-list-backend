export interface IDocumentCreate {
  name: string;
  content?: string;
  favorite?: boolean;
  idParent?: string;
  todolistId: string;
}
export interface IDocumentGet {
  id: string;
}
export interface IDocumentUpdate {
  id: string;
  content: string;
}
