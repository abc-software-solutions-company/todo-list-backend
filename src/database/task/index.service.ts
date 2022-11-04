import { Injectable, BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { AttachmentService } from '../attachment/index.service';
import { CommentService } from '../comment/index.service';
import { TodolistService } from '../todolist/index.service';
import { Task } from './index.entity';
import { ITaskGet, ITaskCreate, ITaskUpdate, ITaskReindex } from './index.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  constructor(
    @InjectRepository(Task)
    readonly repository: Repository<Task>,
    readonly todolist: TodolistService,
    readonly attachment: AttachmentService,
    readonly comment: CommentService,
  ) {}

  async sync() {
    console.log('sync');
  }

  get() {
    return this.repository.find({ where: { isActive: true } });
  }

  getOne({ id }: ITaskGet) {
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: { status: true, todolist: { status: true }, attachmens: true },
      order: { attachmens: { createdDate: 'ASC' } },
    });
  }

  async create({ name, todolistId, description, userId }: ITaskCreate) {
    let i = 0;
    if (name.trim().length == 0) throw new BadRequestException('Emty name');
    while (i < 3) {
      const id = uuid();
      try {
        const index = ((await this.repository.countBy({ todolistId })) + 1) * this.indexStep;
        const list = await this.todolist.repository.findOne({ where: { id: todolistId }, relations: { status: true } });
        const statusId = Number(list.status[0].id);
        const user = this.repository.create({ name, todolistId, description, userId, id, index, statusId });
        console.log('🚀 ~ file: index.service.ts ~ line 63 ~ TaskService ~ create ~ user', user);
        if (list.visibility !== this.todolist.visibilityList.public && list.userId !== userId)
          throw new MethodNotAllowedException();
        return this.repository.save(user);
      } catch {
        i = i + 1;
      }
    }
    throw new BadRequestException('Server Err');
  }

  async update(param: ITaskUpdate) {
    const { id, description, name, isActive, isDone, statusId, userId, attachments, comments } = param;

    if (!id) throw new BadRequestException('Task no existed');

    const task = await this.repository.findOne({
      where: { id },
      relations: { todolist: { status: true } },
    });

    if (!task) throw new MethodNotAllowedException();

    if (task.todolist.visibility !== this.todolist.visibilityList.public && task.todolist.userId !== userId)
      throw new MethodNotAllowedException();

    if (name) {
      task.name = name;
    }

    if (description) {
      task.description = description;
    }

    if (isActive !== undefined) {
      task.isActive = isActive;
    }

    const ascendingStatus = task.todolist.status.sort((a, b) => a.index - b.index);
    const endStatus = ascendingStatus[ascendingStatus.length - 1].id;

    if (isDone !== undefined) {
      if (isDone === true) {
        task.statusId = endStatus;
      } else {
        if (task.statusId == endStatus) {
          task.statusId = ascendingStatus[0].id;
        }
      }
      task.isDone = isDone;
    }

    if (statusId) {
      if (statusId == endStatus) task.isDone = true;
      else task.isDone = false;
      task.statusId = statusId;
    }

    await this.repository.save(task);

    if (attachments) {
      if (attachments.create) await this.attachment.create({ ...attachments.create, taskId: id });
      if (attachments.update) await this.attachment.update({ ...attachments.update, taskId: id });
    }

    if (comments) {
      if (comments.create) await this.comment.create({ ...comments.create, taskId: id });
      if (comments.update) await this.comment.update({ ...comments.update, taskId: id });
    }

    return this.getOne({ id });
  }

  async reindex({ taskFirstId, taskReorderId, taskSecondId, userId }: ITaskReindex) {
    const task = await this.repository.findOne({ where: { id: taskReorderId }, relations: { todolist: true } });
    if (task.todolist.visibility !== this.todolist.visibilityList.public && task.todolist.userId !== userId)
      throw new MethodNotAllowedException('As a private list or read-only list. Only list owner can drag and drop');
    const index1 = Number(taskFirstId ? (await this.repository.findOneBy({ id: taskFirstId })).index : 0);
    const index2 = Number(
      taskSecondId ? (await this.repository.findOneBy({ id: taskSecondId })).index : index1 + this.indexStep,
    );

    if (!task) throw new BadRequestException();

    const index = Math.round((index1 + index2) / 2);
    task.index = index;

    await this.repository.save(task);

    if (index - index1 < 32 || index2 - index < 32) this.reindexAll(task.todolistId);
    return task;
  }

  async reindexAll(todolistId: string) {
    // As a private list or read-only list. Only list owner can drag and drop
    const tasks = await this.repository.find({ where: { todolistId: todolistId }, order: { index: 'ASC' } });
    tasks.forEach(async (task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      await this.repository.save(task);
    });
  }
}
