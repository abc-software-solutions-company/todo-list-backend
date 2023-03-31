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

  async findAll(id: string): Promise<Document[]> {
    return this.repository.find({ where: { todolistId: id } });
  }

  async getDocumentTree(doc: Document): Promise<any> {
    const children = await this.repository.find({ where: { idParent: doc.id } });
    if (children.length > 0) {
      const childNodes = await Promise.all(children.map((child) => this.getDocumentTree(child)));
      return { ...doc, children: childNodes };
    } else {
      return { ...doc };
    }
  }

  async getOne({ id }: IDocumentGet) {
    return await this.repository.findOneBy({ id });
  }

  async get() {
    return await this.repository.find();
  }

  async update({ id, content }: IDocumentUpdate) {
    const result = await this.repository.findOneBy({ id });
    result.content = content;
    return result;
  }
}
