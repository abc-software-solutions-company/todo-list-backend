import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async update({ id, content, name, favorite }: IDocumentUpdate) {
    const result = await this.repository.findOneBy({ id });
    result.content = content;
    result.name = name;
    result.favorite = favorite;
    return this.repository.save(result);
  }

  async getDocumentTreeByTodolistId(todolistId: string): Promise<Document[]> {
    const documents = await this.repository.find({
      where: { todolistId },
      order: { createdAt: 'DESC' },
    });
    const tree = this.buildTree(documents, null);
    return tree;
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
