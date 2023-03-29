export interface IDocumentCreate {
  name: string;
  content?: string;
  favorite?: boolean;
  idParent?: string;
  todolistId: string;
}
export interface IDocumentGetAll {
  id: string;
}
