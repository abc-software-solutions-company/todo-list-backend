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
import { INotificationCreate } from '../notification/index.type';
import { StatusService } from '../status/index.service';
import { TaskUserService } from '../task-user/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';
import { Task } from './index.entity';
import { ITaskGet, ITaskCreate, ITaskUpdate, ITaskReindexAll, ITaskCreateHepler } from './index.type';
import { priorities } from 'src/utils/constants';
import { TodolistUserService } from '../todolist-user/index.service';

@Injectable()
export class TaskService {
  readonly indexStep: number = Math.pow(2, 30);

  constructor(
    @InjectRepository(Task) readonly repository: Repository<Task>,
    @Inject(forwardRef(() => TodolistService)) readonly todolist: TodolistService,
    readonly attachment: AttachmentService,
    readonly comment: CommentService,
    readonly notification: NotificationService,
    readonly member: TodolistUserService,
    readonly taskUser: TaskUserService,
    readonly status: StatusService,
    readonly user: UserService,
  ) {}

  get() {
    return this.repository.find({ where: { isActive: true }, order: { createdDate: 'DESC' }, take: 30 });
  }

  async getOne({ id }: ITaskGet) {
    const task = await this.repository.findOne({
      relations: {
        status: true,
        todolist: { status: true, members: { user: true } },
        attachments: { user: true },
        comments: { user: true },
        assignees: { user: true },
        relatedTasks: { status: true, assignees: { user: true } },
        user: true,
      },
      order: {
        attachments: { createdDate: 'ASC' },
        comments: { createdDate: 'ASC' },
      },
      where: { id, isActive: true },
    });

    const statusRecords = this.status.repository.find({
      select: ['id', 'name', 'color', 'index'],
      where: { todolistId: task.todolist.id, isActive: true },
      order: { index: 'ASC' },
    });

    const memberRecords = this.member.repository.find({
      select: ['todolistId', 'isActive'],
      where: { todolistId: task.todolist.id, isActive: true },
      relations: { user: true },
    });

    const promises = await Promise.all([statusRecords, memberRecords]);

    const status = promises[0];
    const members = promises[1].map(({ user }) => ({ id: user.id, name: user.name, email: user.email }));

    const relatedTasks = task.relatedTasks
      .filter((x) => x.isActive)
      .map((task) => {
        return { ...task, todolist: { ...task.todolist, status, members } };
      });

    return { ...task, relatedTasks };
  }

  async findOrtherTasks({ taskId, todolistId }) {
    const { relatedTasks } = await this.repository.findOne({
      where: { id: taskId, isActive: true },
      relations: { relatedTasks: true },
    });

    const { tasks } = await this.todolist.repository.findOne({
      where: { id: todolistId, isActive: true, tasks: { isActive: true } },
      relations: { tasks: true },
      order: { tasks: { order: 'DESC' } },
    });

    const relatedTaskIds = relatedTasks.map(({ id }) => id);

    const ortherTasks = tasks?.filter(({ id }) => {
      if (taskId === id) return false;
      return !relatedTaskIds.includes(id);
    });

    return ortherTasks;
  }

  async create(param: ITaskCreate) {
    const { todolistId, userId, statusId, priority = priorities.medium } = param;
    if (!defineAll(param)) throw new BadRequestException('Create Task Error Param');

    const { index, indexColumn, order } = await this.createHelper({ todolistId, userId, statusId });
    const id = v4();
    const task = this.repository.create({ id, ...param, index, indexColumn, statusId, order, priority });

    return this.repository.save(task);
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
      isFeature,
      attachment,
      comment,
      type,
      assignee,
      relatedIds,
      indexColumn,
      resetIndexColumn,
    } = param;
    const notifications: INotificationCreate[] = [];
    if (!defineAll(id, userId)) throw new BadRequestException('Task Update Error param');

    const someone = await this.user.repository.findOne({ where: { id: userId } });
    const taskUser = await this.taskUser.repository.findOne({ where: { taskId: id, isActive: true } });

    const task = await this.repository.findOne({
      where: { id },
      relations: { todolist: { status: true }, relatedTasks: true },
    });

    const assigneeId = !taskUser ? null : taskUser.userId;
    const reporterId = task.userId;

    if (
      defineAny(
        name,
        index,
        description,
        storyPoint,
        startDate,
        dueDate,
        priority,
        relatedIds,
        type,
        isActive,
        indexColumn,
        isFeature,
      )
    ) {
      if (name) {
        if (!name.trim()) throw new BadRequestException('Empty name');
        task.name = name;

        if (someone.id !== reporterId) {
          const renameTaskNotificationForReporter: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'rename-task',
            recipientId: reporterId,
            senderId: someone.id,
          };
          notifications.push(renameTaskNotificationForReporter);
        }

        if (assigneeId && assigneeId !== reporterId && assigneeId !== someone.id) {
          const renameTaskNotificationForAssigee: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'rename-task',
            recipientId: assigneeId,
            senderId: someone.id,
          };
          notifications.push(renameTaskNotificationForAssigee);
        }
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

      if (type !== undefined) {
        task.type = type;
      }

      if (startDate !== undefined) {
        task.startDate = startDate;
      }

      if (dueDate !== undefined) {
        task.dueDate = dueDate;
      }

      if (indexColumn !== undefined) {
        task.indexColumn = indexColumn;
      }

      if (isFeature !== undefined) {
        task.isFeature = isFeature;

        if (someone.id !== reporterId) {
          const isFeatureNotificationForReporter: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'isFeature-task',
            recipientId: reporterId,
            senderId: someone.id,
          };

          notifications.push(isFeatureNotificationForReporter);
        }

        if (assigneeId && assigneeId !== reporterId && assigneeId !== someone.id) {
          const isFeatureNotificationForAssigee: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'isFeature-task',
            recipientId: assigneeId,
            senderId: someone.id,
          };

          notifications.push(isFeatureNotificationForAssigee);
        }
      }

      if (resetIndexColumn) {
        const taskInColumn = await this.repository.find({ where: { todolistId: task.todolistId, statusId } });
        taskInColumn.forEach(async (task, index) => {
          task.indexColumn = (index + 1) * this.indexStep;
          await this.repository.save(task);
          console.log(`Reset indexColumn for task ${task.id}`);
        });
      }

      if (priority) {
        if (!Object.values(priorities).includes(priority)) throw new MethodNotAllowedException('Error priority value');

        const beforePriority = JSON.stringify(task);
        task.priority = priority;
        const afterPriority = JSON.stringify(task);

        if (someone.id !== reporterId) {
          const priorityNotificationForReporter: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'priority',
            before: beforePriority,
            after: afterPriority,
            recipientId: reporterId,
            senderId: someone.id,
          };
          notifications.push(priorityNotificationForReporter);
        }

        if (assigneeId && assigneeId !== reporterId && assigneeId !== someone.id) {
          const priorityNotificationForAssignee: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'priority',
            before: beforePriority,
            after: afterPriority,
            recipientId: assigneeId,
            senderId: someone.id,
          };
          notifications.push(priorityNotificationForAssignee);
        }
      }

      if (relatedIds) {
        const relatedTasks = relatedIds.map(async (id) => {
          return await this.repository.findOne({ where: { id } });
        });

        task.relatedTasks = await Promise.all(relatedTasks);
      }

      if (isActive !== undefined) {
        task.isActive = isActive;

        if (someone.id !== reporterId) {
          const deleteNotificationForReporter: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'deleted-task',
            recipientId: reporterId,
            senderId: someone.id,
          };

          notifications.push(deleteNotificationForReporter);
        }

        if (assigneeId && assigneeId !== reporterId && assigneeId !== someone.id) {
          const deleteNotificationForAssigee: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'deleted-task',
            recipientId: assigneeId,
            senderId: someone.id,
          };

          notifications.push(deleteNotificationForAssigee);
        }
      }
      await this.repository.save(task);
      this.notification.createMany(notifications);
    }

    if (defineAny(statusId, isDone)) {
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

        const resStatusBefore = await this.status.repository.findOneBy({ id: task.statusId });
        const resStatusAfter = await this.status.repository.findOneBy({ id: statusId });

        const beforeStatus = JSON.stringify(resStatusBefore);
        const afterStatus = JSON.stringify(resStatusAfter);

        task.statusId = statusId;

        if (someone.id !== reporterId) {
          const statusNotificationForReporter: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'status',
            before: beforeStatus,
            after: afterStatus,
            recipientId: reporterId,
            senderId: someone.id,
          };
          notifications.push(statusNotificationForReporter);
        }

        if (assigneeId && assigneeId !== reporterId && assigneeId !== someone.id) {
          const statusNotificationForAssignee: INotificationCreate = {
            content: task.name,
            link: task.id,
            type: 'status',
            before: beforeStatus,
            after: afterStatus,
            recipientId: assigneeId,
            senderId: someone.id,
          };
          notifications.push(statusNotificationForAssignee);
        }
      }

      await this.repository.save(task);
      this.notification.createMany(notifications);
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
          await this.taskUser.set(
            { taskId: id, ...assignee },
            { taskName: task.name, reporterId: reporterId, someoneId: someone.id },
          );
      }
    }

    return task;
  }

  async reindexAll({ todolistId }: ITaskReindexAll) {
    console.log('Ready for reindex all task in list default');

    if (!defineAll(todolistId)) throw new BadRequestException('Task reindexAll err param');
    const tasks = await this.repository.find({ where: { todolistId }, order: { index: 'ASC' } });
    const promises: Promise<any>[] = [];
    tasks.forEach((task, index) => {
      task.index = (index + 1) * this.indexStep;
      promises.push(this.repository.save(task));
    });
    return Promise.all(promises);
  }

  async createHelper({ todolistId, userId: TaskUserId, statusId }: ITaskCreateHepler) {
    const todolist = await this.todolist.repository.findOne({
      select: ['id', 'visibility', 'userId', 'tasks', 'members'],
      where: { id: todolistId },
      relations: { status: true, tasks: true },
    });

    const order = todolist.tasks.length + 1;
    const index = Number(Math.max(...todolist.tasks.map((e) => e.index), 0)) + this.indexStep;
    const statusIndexColumn = todolist.tasks.filter((e) => e.statusId == statusId).map((e) => e.indexColumn);
    const maxIndexColumn = Number(Math.max(...statusIndexColumn, 0));
    const indexColumn = maxIndexColumn + this.indexStep;
    return { order, index, indexColumn };
  }
}
