import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Document } from './index.entity';
import { IDocumentCreate, IDocumentGet, IDocumentUpdate } from './index.type';

@Injectable()
export class DocumentService {
  constructor(@InjectRepository(Document) readonly repository: Repository<Document>) {}

  async create(param: IDocumentCreate) {
    const id = v4();
    const document = await this.repository.create({ id, ...param });
    return this.repository.save(document);
  }

  async getOne({ id }: IDocumentGet) {
    return await this.repository.findOneBy({ id });
  }

  async update({ id, content, name, favorite, isActive }: IDocumentUpdate) {
    const result = await this.repository.findOneBy({ id });
    result.content = content;
    result.name = name;
    result.favorite = favorite;
    result.isActive = isActive;
    return this.repository.save(result);
  }

  async handleFavorite(documentId) {
    const result = await this.repository.findOneBy({ id: documentId });
    const lastDocument = await this.repository.findOne({
      where: { todolistId: result.todolistId, favorite: Not(IsNull()) },
      order: { favorite: 'DESC' },
    });
    if (result.favorite === null) result.favorite = result.favorite = lastDocument ? lastDocument.favorite + 1 : 1;
    else result.favorite = null;
    return this.repository.save(result);
  }

  async getDocumentTreeByTodolistId(todolistId: string): Promise<Document[]> {
    const documents = await this.repository.find({
      where: { todolistId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    const tree = this.buildTree(documents, null);
    return tree;
  }

  async getDocumentsFavorite(todolistId: string): Promise<Document[]> {
    const documents = await this.repository.find({
      where: { todolistId, isActive: true, favorite: Not(IsNull()) },
    });

    const tree = this.buildTree(await this.repository.find({ where: { todolistId, isActive: true } }), null);

    const favoriteHasChildIds = new Set(tree.filter((item) => item.children).map((item) => item.id));

    const filteredDocuments = documents.filter((doc) => !favoriteHasChildIds.has(doc.id));

    const mergedDocuments = [...tree.filter((item) => item.children), ...filteredDocuments];

    mergedDocuments.sort((a, b) => b.favorite - a.favorite);

    return mergedDocuments;
  }

  private buildTree(documents: Document[], parentId: string): Document[] {
    const tree: Document[] = [];

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      if (document.parentId === parentId) {
        const children = this.buildTree(documents, document.id);
        if (children.length) {
          document.children = children;
        }
        tree.push(document);
      }
    }

    return tree;
  }
}
