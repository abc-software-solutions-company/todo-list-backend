import { Injectable, BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { ImageService } from '../image/image.service';
import { TaskImageService } from '../taskImage/taskImage.service';
import { TodolistService } from '../todolist/todolist.service';
import { Task } from './task.entity';
import { IGet, ICreate, IUpdate, IReIndex } from './task.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  constructor(
    @InjectRepository(Task)
    readonly repository: Repository<Task>,
    readonly todolist: TodolistService,
    readonly taskImage: TaskImageService,
    readonly image: ImageService,
  ) {}

  async sync() {
    // const all = await this.repository.find({ relations: { todoList: { status: true } } });
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
    //   await this.repository.save(task);
    // }
  }

  get() {
    return this.repository.find({ where: { isActive: true }, relations: { taskImages: true } });
  }

  getOne({ id }: IGet) {
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: { taskImages: { image: true }, status: true, todoList: { status: true } },
      order: { taskImages: { image: { createdDate: 'ASC' } } },
    });
  }

  async create({ name, todoListId, description, userId }: ICreate) {
    let i = 0;
    if (name.trim().length == 0) return new BadRequestException('Emty name');
    while (i < 3) {
      const id = uuid();
      try {
        const index = ((await this.repository.countBy({ todoListId })) + 1) * this.indexStep;
        const list = await this.todolist.repository.findOne({ where: { id: todoListId }, relations: { status: true } });
        const statusId = Number(list.status[0].id);
        const user = this.repository.create({ name, todoListId, description, userId, id, index, statusId });
        if (list.visibility !== this.todolist.visibilityList.public && list.userId !== userId)
          return new MethodNotAllowedException();
        return this.repository.save(user);
      } catch {
        i = i + 1;
      }
    }
    return new BadRequestException('Server Err');
  }

  async update(body: IUpdate) {
    if (!body) return new BadRequestException('Params');
    const { isActive, isDone, description, name, id, statusId, userId, images } = body;
    const task = await this.repository.findOne({
      where: { id },
      relations: { todoList: { status: true }, taskImages: true },
    });
    if (!task) return new MethodNotAllowedException();
    if (task.todoList.visibility !== this.todolist.visibilityList.public && task.todoList.userId !== userId)
      return new MethodNotAllowedException();
    task.isActive = isActive === undefined ? task.isActive : isActive;
    task.name = name ? name : task.name;
    task.description = description ? description : task.description;
    const ascendingStatus = task.todoList.status.sort((a, b) => a.index - b.index);
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

    if (!images) return this.repository.save(task);
    else {
      await this.repository.save(task);
      if (images.add && images.add.length > 0) {
        for (let i = 0; i < images.add.length; i++) {
          const { link, name } = images.add[i];
          const image = await this.image.create({ link, name });
          await this.taskImage.create({ imageId: image.id, taskId: task.id });
        }
      }
      if (images.edit && images.edit.length > 0) {
        for (let i = 0; i < images.edit.length; i++) {
          const { id, name } = images.edit[i];
          await this.image.update({ id, name });
        }
      }
      if (images.remove && images.remove.length > 0) {
        for (let i = 0; i < images.remove.length; i++) {
          const imageId = images.remove[i];
          await this.taskImage.update({ imageId, taskId: task.id, isActive: false });
        }
      }
      return this.getOne({ id });
    }
  }

  async reIndex({ taskFirstId, taskReorderId, taskSecondId, userId }: IReIndex) {
    const task = await this.repository.findOne({ where: { id: taskReorderId }, relations: { todoList: true } });
    if (task.todoList.visibility !== this.todolist.visibilityList.public && task.todoList.userId !== userId)
      return new MethodNotAllowedException('As a private list or read-only list. Only list owner can drag and drop');
    const index1 = Number(taskFirstId ? (await this.repository.findOneBy({ id: taskFirstId })).index : 0);
    const index2 = Number(
      taskSecondId ? (await this.repository.findOneBy({ id: taskSecondId })).index : index1 + this.indexStep,
    );

    if (!task) return new BadRequestException();

    const index = Math.round((index1 + index2) / 2);
    task.index = index;

    await this.repository.save(task);

    if (index - index1 < 32 || index2 - index < 32) this.reAllIndex(task.todoListId);
    return task;
  }

  async reAllIndex(todoListId: string) {
    // As a private list or read-only list. Only list owner can drag and drop
    const tasks = await this.repository.find({ where: { todoListId: todoListId }, order: { index: 'ASC' } });
    tasks.forEach(async (task, index) => {
      task.index = (index + 1) * this.indexStep;
      console.log(task);
      await this.repository.save(task);
    });
  }
}
