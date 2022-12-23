import {
  Injectable,
  BadRequestException,
  MethodNotAllowedException,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll, defineAny } from 'src/utils/function';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AttachmentService } from '../attachment/index.service';
import { CommentService } from '../comment/index.service';
import { NotificationService } from '../notification/index.service';
import { StatusService } from '../status/index.service';
import { TaskUserService } from '../task-user/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';
import { Task } from './index.entity';
import { ITaskGet, ITaskCreate, ITaskUpdate, ITaskReindexAll, ITaskCreateHepler } from './index.type';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);
  readonly priorities = { lowest: 'Lowest', low: 'Low', medium: 'Medium', high: 'High', highest: 'Highest' };

  constructor(
    @InjectRepository(Task) readonly repository: Repository<Task>,
    @Inject(forwardRef(() => TodolistService)) readonly todolist: TodolistService,
    readonly attachment: AttachmentService,
    readonly comment: CommentService,
    readonly notification: NotificationService,
    readonly taskUser: TaskUserService,
    readonly status: StatusService,
    readonly user: UserService,
  ) {}

  get() {
    return this.repository.find({ where: { isActive: true } });
  }

  getOne({ id }: ITaskGet) {
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: {
        status: true,
        todolist: { status: true, members: { user: true } },
        attachments: { user: true },
        comments: { user: true },
        assignees: { user: true },
        user: true,
      },
      order: {
        attachments: { createdDate: 'ASC' },
        comments: { createdDate: 'ASC' },
      },
    });
  }

  async create(param: ITaskCreate) {
    const { todolistId, userId, statusId: statusIdParam } = param;
    if (!defineAll(param)) throw new BadRequestException('Create Task Error Param');

    const { index, statusId } = await this.createHelper({ todolistId, userId });
    const id = v4();

    let user: Task;
    if (!statusIdParam) user = this.repository.create({ id, ...param, index, statusId });
    else user = this.repository.create({ id, ...param, index, statusId: statusIdParam });

    return this.repository.save(user);
  }

  async update(param: ITaskUpdate) {
    const {
      id,
      userId,
      name,
      description,
      index,
      storyPoint,
      priority,
      statusId,
      isDone,
      startDate,
      dueDate,
      isActive,
      attachment,
      comment,
      assignee,
    } = param;

    if (!defineAll(id, userId)) throw new BadRequestException('Task Update Error param');

    const someone = await this.user.repository.findOne({ where: { id: userId } });
    const taskUser = await this.taskUser.repository.findOne({ where: { taskId: id, isActive: true } });

    const task = await this.repository.findOne({
      where: { id },
      relations: { todolist: { status: true } },
    });

    const assigneeId = !taskUser ? null : taskUser.userId;
    const reporterId = task.userId;

    const write = task.todolist.visibility === this.todolist.visibilityList.public || task.todolist.userId === userId;

    if (!write) throw new ForbiddenException(`You can't update this todolist`);

    if (defineAny(name, index, description, storyPoint, startDate, dueDate, priority, isActive)) {
      if (name) {
        if (!name.trim()) throw new BadRequestException('Empty name');
        task.name = name;
      }

      if (index !== undefined) {
        task.index = index;
      }

      if (description !== undefined) {
        task.description = description;
      }

      if (storyPoint !== undefined) {
        task.storyPoint = storyPoint;
      }

      if (startDate !== undefined) {
        task.startDate = startDate;
      }

      if (dueDate !== undefined) {
        task.dueDate = dueDate;
      }

      if (priority) {
        if (!Object.values(this.priorities).includes(priority))
          throw new MethodNotAllowedException('Error priority value');
        await this.notification.create({
          content: `${someone.name} changed a task ${task.name} from ${task.priority} to ${priority}`,
          type: 'task',
          userId: assigneeId,
        });
        task.priority = priority;
      }

      if (isActive !== undefined) {
        task.isActive = isActive;

        if (taskUser.userId && taskUser.userId === someone.id) {
          this.notification.create({
            content: `${someone.name} delete to a task ${task.name}`,
            type: 'task',
            userId: taskUser.userId,
          });

          this.notification.create({
            content: `${someone.name} delete to a task ${task.name}`,
            type: 'task',
            userId: task.userId,
          });
        } else {
          this.notification.create({
            content: `${someone.name} delete to a task ${task.name}`,
            type: 'task',
            userId: task.userId,
          });
        }
      }
      await this.repository.save(task);
    }

    if (defineAny(statusId, isDone)) {
      const ascendingStatus = task.todolist.status.sort((a, b) => a.index - b.index);
      const endStatus = ascendingStatus[ascendingStatus.length - 1].id;
      const filterStatus = ascendingStatus.filter((e) => {
        if (e.id == task.statusId || e.id == statusId) {
          return e;
        }
      });
      const currentStatus = filterStatus[0].name;
      const afterStatus = filterStatus[1].name;

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
      if (assigneeId == someone.id) {
        await this.notification.create({
          content: `${someone.name} changed a task ${task.name} from ${currentStatus} to ${afterStatus}`,
          link: task.id,
          type: 'task',
          userId: reporterId,
        });
      } else {
        await this.notification.create({
          content: `${someone.name} changed a task ${task.name} from ${currentStatus} to ${afterStatus}`,
          link: task.id,
          type: 'task',
          userId: assigneeId,
        });
      }
    }

    if (defineAny(attachment, comment, assignee)) {
      if (attachment) {
        if (attachment.create) await this.attachment.create({ ...attachment.create, taskId: id, userId });
        if (attachment.update) await this.attachment.update({ ...attachment.update, taskId: id, userId });
      }

      if (comment) {
        if (comment.create) await this.comment.create({ ...comment.create, taskId: id, userId });
        if (comment.update) await this.comment.update({ ...comment.update, taskId: id, userId });
      }

      if (assignee) {
        if (assignee.ids)
          await this.taskUser.set({
            taskId: id,
            reporterId: reporterId,
            assignorId: someone.id,
            ...assignee,
          });
      }
    }

    return task;
  }

  async reindexAll({ todolistId }: ITaskReindexAll) {
    if (!defineAll(todolistId)) throw new BadRequestException('Task reindexAll err param');
    const tasks = await this.repository.find({ where: { todolistId }, order: { index: 'ASC' } });
    const promises: Promise<any>[] = [];
    tasks.forEach((task, index) => {
      task.index = (index + 1) * this.indexStep;
      promises.push(this.repository.save(task));
    });
    return Promise.all(promises);
  }

  async createHelper({ todolistId, userId: TaskUserId }: ITaskCreateHepler) {
    const tasksLength = this.repository.count({ where: { todolistId } });
    const todolist = this.todolist.repository.findOne({
      select: { id: true, visibility: true, userId: true },
      where: { id: todolistId },
      relations: { status: true },
    });

    const status = this.status.repository.find({ where: { todolistId }, order: { index: 'ASC' } });

    const promises = await Promise.all([todolist, tasksLength, status]);

    const { visibility, userId } = promises[0];

    if (visibility !== this.todolist.visibilityList.public && userId !== TaskUserId)
      throw new MethodNotAllowedException();

    return { index: (promises[1] + 1) * this.indexStep, statusId: promises[2][0].id };
  }
}
