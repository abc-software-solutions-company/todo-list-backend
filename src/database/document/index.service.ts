import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Document } from './index.entity';
import { IDocumentCreate, IDocumentGetAll } from './index.type';

@Injectable()
export class DocumentService {
  constructor(@InjectRepository(Document) readonly repository: Repository<Document>) {}

  async create(param: IDocumentCreate) {
    const id = v4();
    const document = await this.repository.create({ id, ...param });
    return this.repository.save(document);
  }

  async findAll({ id }: IDocumentGetAll): Promise<Document[]> {
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
}
