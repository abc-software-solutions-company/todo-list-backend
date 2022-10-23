import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { ICreate, IInit, IUpdate } from './status.type';

@Injectable()
export class StatusService {
  readonly indexStep: number = Math.pow(2, 30);
  readonly defaultStatus: { name: string; color: string }[] = [
    { name: 'Backlog', color: '#78716C' },
    { name: 'To-Do', color: '#0EA5E9' },
    { name: 'In-progress', color: '#F59E0B' },
    { name: 'In-review', color: '#F43F5E' },
    { name: 'In-QA', color: '#8B5CF6' },
    { name: 'Done', color: '#22C55E' },
  ];
  constructor(@InjectRepository(Status) readonly repo: Repository<Status>) {}

  async init({ todoListId }: IInit) {
    const result = [];
    for (let i = 0; i < this.defaultStatus.length; i++) {
      const instance = this.repo.create({ ...this.defaultStatus[i], index: (i + 1) * this.indexStep, todoListId });
      const status = await this.repo.save(instance);
      result.push(status);
    }
    return result;
  }

  create({ todoListId, name }: ICreate) {
    if (!todoListId || !name) return new BadRequestException();
    return this.repo.save(this.repo.create({ name, todoListId }));
  }

  async update({ id, todoListId, name }: IUpdate) {
    if (!id || !todoListId || !name) return new BadRequestException();
    const status = await this.repo.findOneBy({ id, todoListId });
    if (status.name === name) return new BadRequestException();
    status.name = name;
    return this.repo.save(status);
  }
}
