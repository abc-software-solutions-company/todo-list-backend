import { Injectable, MethodNotAllowedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { TodolistService } from '../todolist/todolist.service';
import { Task } from './task.entity';
import { ICreate, IGet, IReIndex, IUpdate } from './task.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  constructor(@InjectRepository(Task) readonly repo: Repository<Task>, readonly todolist: TodolistService) {}

  async sync() {
    // const all = await this.repo.find({ relations: { todoList: { status: true } } });
    // for (let i = 0; i < all.length; i++) {
    //   console.log('🚀 ~ file: task.service.ts ~ line 18 ~ TaskService ~ sync ~ i', i);
    //   const task = all[i];
    //   const ascendingStatus = task.todoList.status.sort((a, b) => a.index - b.index);
    //   const statStatus = ascendingStatus[0].id;
    //   const endStatus = ascendingStatus[ascendingStatus.length - 1].id;
    //   if (task.isDone === true || task.statusId === endStatus) {
    //     task.isDone = true;
    //     task.statusId = endStatus;
    //   } else {
    //     task.isDone = false;
    //     if (task.statusId === endStatus) task.statusId = statStatus;
    //   }
    //   await this.repo.save(task);
    // }
  }
  get() {
    return this.repo.findBy({ isActive: true });
  }

  getOne({ id }: IGet) {
    return this.repo.findOneBy({ id, isActive: true });
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
        // As a readonly list or private list, Only list owner can create task for this list.
        if (list.visibility !== this.todolist.visibilityList.public && list.userId !== userId)
          return new MethodNotAllowedException(
            'As a readonly list or private list, Only list owner can create task for this list.',
          );

        return this.repo.save(user);
      } catch {
        i = i + 1;
      }
    }
    return new BadRequestException('Server Err');
  }

  async update(body: IUpdate) {
    if (!body) return new BadRequestException();
    const { isActive, isDone, name, id, statusId, userId } = body;
    const task = await this.repo.findOne({ where: { id }, relations: { todoList: { status: true } } });
    if (!task) return new MethodNotAllowedException();
    task.isActive = isActive === undefined ? task.isActive : isActive;
    task.name = name ? name : task.name;
    // As a task created from read-only list or private list. Only list owner can update this task.
    if (task.todoList.visibility !== this.todolist.visibilityList.public && task.todoList.userId !== userId)
      return new MethodNotAllowedException(
        'As a task created from read-only list or private list. Only list owner can update this task.',
      );
    const ascendingStatus = task.todoList.status.sort((a, b) => a.index - b.index);
    const endStatus = ascendingStatus[ascendingStatus.length - 1].id;
    if (isDone !== undefined) {
      if (isDone === true) {
        task.statusId = endStatus;
      } else {
        if (task.statusId == endStatus) {
          const statStatus = ascendingStatus[0].id;
          task.statusId = statStatus;
        }
      }
      task.isDone = isDone;
    }
    if (statusId) {
      if (statusId == endStatus) task.isDone = true;
      else task.isDone = false;
      task.statusId = statusId;
    }

    return this.repo.save(task);
  }

  async reIndex({ taskFirstId, taskReorderId, taskSecondId, userId }: IReIndex) {
    const task = await this.repo.findOne({ where: { id: taskReorderId }, relations: { todoList: true } });
    if (task.todoList.visibility !== this.todolist.visibilityList.public && task.todoList.userId !== userId)
      return new MethodNotAllowedException('As a private list or read-only list. Only list owner can drag and drop');
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

  async reAllIndex(todoListId: string) {
    // As a private list or read-only list. Only list owner can drag and drop
    const tasks = await this.repo.find({ where: { todoListId: todoListId }, order: { index: 'ASC' } });
    tasks.forEach(async (task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      await this.repo.save(task);
    });
  }
}
