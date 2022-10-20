import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { ICreate, IInit, IUpdate } from './status.type';

@Injectable()
export class StatusService {
  readonly defaultStatus: string[] = ['Backlog', 'To-Do', 'In-progress', 'In-review', 'In-QA', 'Done'];
  constructor(@InjectRepository(Status) readonly repo: Repository<Status>) {}

  async init({ todoListId }: IInit) {
    const result = [];
    for (let index = 0; index < this.defaultStatus.length; index++) {
      const status = await this.repo.save(this.repo.create({ name: this.defaultStatus[index], todoListId }));
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
