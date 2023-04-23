import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { Status } from './index.entity';
import { IStatusCreate, IStatusInit, IStatusReindexAll, IStatusUpdate } from './index.type';

@Injectable()
export class StatusService {
  readonly indexStep: number = Math.pow(2, 30);

  readonly defaultStatus: { name: string; color: string }[] = [
    { name: 'Backlog', color: '#78716C' },
    { name: 'To-Do', color: '#0EA5E9' },
    { name: 'In-Progress', color: '#F59E0B' },
    { name: 'In-Review', color: '#F43F5E' },
    { name: 'In-QA', color: '#8B5CF6' },
    { name: 'Done', color: '#22C55E' },
  ];

  constructor(@InjectRepository(Status) readonly repository: Repository<Status>) {}

  async init({ todolistId }: IStatusInit) {
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

  create(param: IStatusCreate) {
    const { todolistId, name } = param;
    if (!name || (name && !name.trim())) throw new BadRequestException('Empty name');
    const newTodolist = this.repository.create({ name, todolistId });

    return this.repository.save(newTodolist);
  }

  async update(param: IStatusUpdate) {
    const { id, todolistId, name, isActive, index } = param;
    if (!id) throw new BadRequestException('Empty id');
    const status = await this.repository.findOneBy({ id, todolistId });
    if (!status) throw new BadRequestException('Todolist not existed');

    if (name) {
      if (!name.trim()) throw new BadRequestException('Empty status name');
      status.name = name;
    }

    if (isActive !== undefined) {
      status.isActive = isActive;
    }

    if (index > 0) status.index = index;

    return this.repository.save(status);
  }

  async resetIndex({ todolistId }: IStatusReindexAll) {
    if (!defineAll(todolistId)) throw new BadRequestException('Task reindexAll err param');
    const statusList = await this.repository.find({ where: { todolistId }, order: { index: 'ASC' } });
    const promises: Promise<any>[] = [];
    statusList.forEach((status, index) => {
      status.index = (index + 1) * this.indexStep;
      promises.push(this.repository.save(status));
    });
    return Promise.all(promises);
  }
}
