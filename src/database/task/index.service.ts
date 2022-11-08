import { Injectable, BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AttachmentService } from '../attachment/index.service';
import { CommentService } from '../comment/index.service';
import { TodolistService } from '../todolist/index.service';
import { Task } from './index.entity';
import { ITaskGet, ITaskCreate, ITaskUpdate, ITaskReindex } from './index.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  readonly priorities = { lowest: 'Lowest', low: 'Low', medium: 'Medium', high: 'High', highest: 'Highest' };

  constructor(
    @InjectRepository(Task)
    readonly repository: Repository<Task>,
    readonly todolist: TodolistService,
    readonly attachment: AttachmentService,
    readonly comment: CommentService,
  ) {}

  get() {
    return this.repository.find({ where: { isActive: true } });
  }

  getOne({ id }: ITaskGet) {
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: { status: true, todolist: { status: true }, attachments: { user: true }, comments: { user: true } },
      order: { attachments: { createdDate: 'ASC' }, comments: { createdDate: 'ASC' } },
    });
  }

  async create(param: ITaskCreate) {
    const { name, todolistId, description, userId } = param;
    if (!name.trim()) throw new BadRequestException('empty name ');
    const list = await this.todolist.getOne({ id: todolistId });
    if (list.visibility !== this.todolist.visibilityList.public && list.userId !== userId)
      throw new MethodNotAllowedException();
    const id = v4();
    const index = (list.tasks.length + 1) * this.indexStep;
    const statusId = Number(list.status[0].id);
    const user = this.repository.create({ name, todolistId, description, userId, id, index, statusId });
    return this.repository.save(user);
  }

  async update(param: ITaskUpdate) {
    const { id, description, priority, name, isActive, isDone, statusId, userId, attachment, comment } = param;

    if (!id) throw new BadRequestException('Task no existed');

    const task = await this.repository.findOne({
      where: { id },
      relations: { todolist: { status: true } },
    });

    if (task.todolist.visibility !== this.todolist.visibilityList.public && task.todolist.userId !== userId)
      throw new MethodNotAllowedException();

    if (name && name.trim()) {
      task.name = name;
    }

    if (description !== undefined) {
      task.description = description;
    }
    if (priority) {
      if (!Object.values(this.priorities).includes(priority))
        throw new MethodNotAllowedException('Error priority value');
      task.priority = priority;
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

    if (attachment) {
      if (attachment.create) await this.attachment.create({ ...attachment.create, taskId: id, userId });
      if (attachment.update) await this.attachment.update({ ...attachment.update, taskId: id, userId });
    }

    if (comment) {
      if (comment.create) await this.comment.create({ ...comment.create, taskId: id, userId });
      if (comment.update) await this.comment.update({ ...comment.update, taskId: id, userId });
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

    if (index - index1 < 32 || index2 - index < 32) await this.reindexAll(task.todolistId);

    return this.getOne({ id: taskReorderId });
  }

  async reindexAll(todolistId: string) {
    const tasks = await this.repository.find({ where: { todolistId: todolistId }, order: { index: 'ASC' } });
    const promises: Promise<any>[] = [];
    tasks.forEach((task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      promises.push(this.repository.save(task));
    });
    await Promise.all(promises);
  }
}
