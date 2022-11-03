import { Injectable, BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { AttachmentService } from '../attachment/index.service';
import { TaskAttachmentService } from '../task-attachment/index.service';
import { TodolistService } from '../todolist/index.service';
import { Task } from './index.entity';
import { IGet, ICreate, IUpdate, IReIndex } from './index.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  constructor(
    @InjectRepository(Task)
    readonly repository: Repository<Task>,
    readonly todolist: TodolistService,
    readonly taskAttachment: TaskAttachmentService,
    readonly attachment: AttachmentService,
  ) {}

  async sync() {
    // const all = await this.repository.find({ relations: { todolist: { status: true } } });
    // for (let i = 0; i < all.length; i++) {
    //   console.log('🚀 ~ file: task.service.ts ~ line 18 ~ TaskService ~ sync ~ i', i);
    //   const task = all[i];
    //   const ascendingStatus = task.todolist.status.sort((a, b) => a.index - b.index);
    //   const statStatus = ascendingStatus[0].id;
    //   const endStatus = ascendingStatus[ascendingStatus.length - 1].id;
    //   if (task.isDone === true || task.statusId === endStatus) {
    //     task.isDone = true;
    //     task.statusId = endStatus;
    //   } else {
    //     task.isDone = false;
    //     if (task.statusId === endStatus) task.statusId = statStatus;
    //   }
    //   await this.repository.save(task);
    // }
  }

  get() {
    return this.repository.find({ where: { isActive: true }, relations: { taskAttachments: true } });
  }

  getOne({ id }: IGet) {
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: { taskAttachments: { attachment: true }, status: true, todolist: { status: true } },
      order: { taskAttachments: { attachment: { createdDate: 'ASC' } } },
    });
  }

  async create({ name, todolistId, description, userId }: ICreate) {
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

  async update(body: IUpdate) {
    if (!body) throw new BadRequestException('Params');
    const { isActive, isDone, description, name, id, statusId, userId, attachments } = body;
    const task = await this.repository.findOne({
      where: { id },
      relations: { todolist: { status: true }, taskAttachments: true },
    });
    if (!task) throw new MethodNotAllowedException();
    if (task.todolist.visibility !== this.todolist.visibilityList.public && task.todolist.userId !== userId)
      throw new MethodNotAllowedException();
    task.isActive = isActive === undefined ? task.isActive : isActive;
    task.name = name ? name : task.name;
    task.description = description ? description : task.description;
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

    if (!attachments) return this.repository.save(task);
    else {
      await this.repository.save(task);
      if (attachments.add) {
        const { link, name } = attachments.add;
        const attachment = await this.attachment.create({ link, name });
        await this.taskAttachment.create({ attachmentId: attachment.id, taskId: task.id });
      }
      if (attachments.edit && attachments.edit) {
        const { id, name } = attachments.edit;
        await this.attachment.update({ id, name });
      }
      if (attachments.remove && attachments.remove) {
        const { id } = attachments.remove;
        await this.taskAttachment.update({ attachmentId: id, taskId: task.id, isActive: false });
      }
      return this.getOne({ id });
    }
  }

  async reIndex({ taskFirstId, taskReorderId, taskSecondId, userId }: IReIndex) {
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

    if (index - index1 < 32 || index2 - index < 32) this.reAllIndex(task.todolistId);
    return task;
  }

  async reAllIndex(todolistId: string) {
    // As a private list or read-only list. Only list owner can drag and drop
    const tasks = await this.repository.find({ where: { todolistId: todolistId }, order: { index: 'ASC' } });
    tasks.forEach(async (task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      await this.repository.save(task);
    });
  }
}
