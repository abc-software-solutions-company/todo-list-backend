import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Document } from './index.entity';
import { IDocumentCreate, IDocumentGet, IDocumentUpdate } from './index.type';
import { TodolistService } from '../todolist/index.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document) readonly repository: Repository<Document>,
    readonly todolist: TodolistService,
  ) {}

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

  async getDocumentTreeByTodolistId(todolistId: string, userId: string): Promise<Document[]> {
    const documents = await this.repository.find({
      where: { todolistId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    const { name: listName } = await this.todolist.getOne({ id: todolistId, userId });
    console.log('🚀 ~ file: index.service.ts:41 ~ DocumentService ~ getDocumentTreeByTodolistId ~ listName:', listName);
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
