import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './index.entity';
import { IStatusCreate, IStatusInit, IStatusUpdate } from './index.type';

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
    const { id, todolistId, name, isActive } = param;
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

    return this.repository.save(status);
  }
}
