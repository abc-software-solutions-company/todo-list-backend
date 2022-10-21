import { Injectable, MethodNotAllowedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { TodolistService } from '../todolist/todolist.service';
import { ReIndexDto } from './task.dto';
import { Task } from './task.entity';
import { ICreate, IGet, IUpdate } from './task.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  constructor(@InjectRepository(Task) readonly repo: Repository<Task>, readonly todolist: TodolistService) {}

  getByListId({ todoListId }: IGet) {
    if (!todoListId) return new MethodNotAllowedException();
    const TaskList = this.repo.find({ where: { todoListId, isActive: true }, order: { index: 'ASC' } });
    if (!TaskList) return new MethodNotAllowedException();
    return TaskList;
  }

  async create({ name, todoListId, userId }: ICreate) {
    let i = 0;
    if (name.trim().length == 0) return new BadRequestException('Emty name');
    while (i < 3) {
      const id = uuid();
      try {
        const index = ((await this.repo.countBy({ todoListId })) + 1) * this.indexStep;
        const list = await this.todolist.repo.findOne({ where: { id: todoListId }, relations: { status: true } });
        const statusId = Number(list.status[0].id);
        const user = this.repo.create({ name, todoListId, userId, id, index, statusId });
        // As a readonly list, Only list owner can create task for this list.
        if (list.visibility === 1 && list.userId === userId)
          return new BadRequestException('As a readonly list, Only list owner can create task for this list');

        return this.repo.save(user);
      } catch {
        i = i + 1;
      }
    }
    return new BadRequestException('Server Err');
  }

  async update(body: IUpdate) {
    if (!body) return new BadRequestException();
    const { isActive, isDone, name, id, statusId } = body;
    const task = await this.repo.findOneBy({ id });
    if (!task) return new MethodNotAllowedException();
    task.isActive = isActive === undefined ? task.isActive : isActive;
    task.isDone = isDone === undefined ? task.isDone : isDone;
    task.name = name ? name : task.name;
    task.statusId = statusId ? statusId : task.statusId;
    console.log(task.name);

    return this.repo.save(task);
  }

  async reAllIndex(todoListId: string) {
    const tasks = await this.repo.find({ where: { todoListId: todoListId }, order: { index: 'ASC' } });
    tasks.forEach(async (task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      await this.repo.save(task);
    });
  }

  async reIndex({ taskFirstId, taskReorderId, taskSecondId }: ReIndexDto) {
    const task = await this.repo.findOneBy({ id: taskReorderId });
    const index1 = Number(taskFirstId ? (await this.repo.findOneBy({ id: taskFirstId })).index : 0);
    const index2 = Number(
      taskSecondId ? (await this.repo.findOneBy({ id: taskSecondId })).index : index1 + this.indexStep,
    );

    if (!task) return new BadRequestException();

    const index = Math.round((index1 + index2) / 2);
    task.index = index;

    await this.repo.save(task);

    if (index - index1 < 32 || index2 - index < 32) this.reAllIndex(task.todoListId);
    return task;
  }
}
