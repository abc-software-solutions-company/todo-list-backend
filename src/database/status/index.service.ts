import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './index.entity';
import { ICreate, IInit, IUpdate } from './index.type';

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
  constructor(@InjectRepository(Status) readonly repository: Repository<Status>) {}

  async init({ todolistId }: IInit) {
    const result = [];
    for (let i = 0; i < this.defaultStatus.length; i++) {
      const instance = this.repository.create({
        ...this.defaultStatus[i],
        index: (i + 1) * this.indexStep,
        todolistId,
      });
      const status = await this.repository.save(instance);
      result.push(status);
    }
    return result;
  }

  create({ todolistId, name }: ICreate) {
    if (!todolistId || !name) throw new BadRequestException();
    return this.repository.save(this.repository.create({ name, todolistId }));
  }

  async update({ id, todolistId, name }: IUpdate) {
    if (!id || !todolistId || !name) throw new BadRequestException();
    const status = await this.repository.findOneBy({ id, todolistId });
    if (status.name === name) throw new BadRequestException();
    status.name = name;
    return this.repository.save(status);
  }
}
