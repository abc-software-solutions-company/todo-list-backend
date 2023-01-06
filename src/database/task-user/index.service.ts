import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/index.service';
import { INotificationCreate } from '../notification/index.type';
import { UserService } from '../user/index.service';
import { TaskUser } from './index.entity';
import { ITaskUserCreate, ITaskUserGet } from './index.type';

@Injectable()
export class TaskUserService {
  constructor(
    @InjectRepository(TaskUser) readonly repository: Repository<TaskUser>,
    readonly user: UserService,
    readonly notification: NotificationService,
  ) {}

  async set(param: ITaskUserCreate, paramGet: ITaskUserGet) {
    const { taskId, ids } = param;
    const { taskName, someoneId, reporterId } = paramGet;

    if (!defineAll(taskId, someoneId, ids, ...ids)) throw new BadRequestException('Task-User Set Err Param');
    const oldAssignees = await this.repository.findBy({ taskId, isActive: true });
    const someone = await this.user.repository.findOneBy({ id: someoneId });

    if (oldAssignees.length) {
      const notifications: INotificationCreate[] = [];
      const promise = [];
      oldAssignees.map((e) => {
        e.isActive = false;

        if (someone.id !== reporterId) {
          const notificationForReporter: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: someoneId === e.userId ? 'unassigned-myself' : 'unassigned',
            recipientId: reporterId,
            senderId: someone.id,
          };
          notifications.push(notificationForReporter);
        }

        if (someone.id !== e.userId) {
          const notificationForAssigee: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: 'unassigned',
            recipientId: e.userId,
            senderId: reporterId,
          };
          notifications.push(notificationForAssigee);
        }

        promise.push(this.repository.save(e));
      });
      await Promise.allSettled(promise);
      this.notification.createMany(notifications);
    }

    if (ids.length) {
      const notifications: INotificationCreate[] = [];
      const promise = [];
      const where = ids.map((e) => ({ id: e }));
      const users = await this.user.repository.findBy(where);

      users.map((e) => {
        const newAssignee = this.repository.create({ taskId, userId: e.id, isActive: true });

        promise.push(this.repository.save(newAssignee));

        if (someone.id !== e.id) {
          const notificationForAssigee: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: 'assigned',
            recipientId: e.id,
            senderId: someone.id,
          };
          notifications.push(notificationForAssigee);
        }

        if (someone.id !== reporterId && someoneId === e.id) {
          const notificationForReporter: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: 'assigned-myself',
            recipientId: reporterId,
            senderId: someone.id,
          };
          notifications.push(notificationForReporter);
        }
      });

      await Promise.allSettled(promise);
      this.notification.createMany(notifications);
    }
  }
}
