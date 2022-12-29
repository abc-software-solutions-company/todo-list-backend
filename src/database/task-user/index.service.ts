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
    const { taskName, assignorId, reporterId } = paramGet;

    if (!defineAll(taskId, assignorId, ids, ...ids)) throw new BadRequestException('Task-User Set Err Param');
    const oldAssignees = await this.repository.findBy({ taskId, isActive: true });
    const assignor = await this.user.repository.findOneBy({ id: assignorId });

    if (oldAssignees.length) {
      const promise = [];
      oldAssignees.map((e) => {
        e.isActive = false;
        promise.push(this.repository.save(e));
      });
      await Promise.allSettled(promise);
    }

    if (ids.length) {
      const notifications: INotificationCreate[] = [];
      const promise = [];
      const where = ids.map((e) => ({ id: e }));
      const users = await this.user.repository.findBy(where);

      users.map((e) => {
        const newAssignee = this.repository.create({ taskId, userId: e.id, isActive: true });

        promise.push(this.repository.save(newAssignee));
        if (assignorId !== reporterId && assignorId === e.id) {
          const notificationForReporter: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: 'assigned',
            recipientId: reporterId,
            senderId: assignor.id,
          };
          notifications.push(notificationForReporter);
        } else {
          const notificationForAssigee: INotificationCreate = {
            content: taskName,
            link: taskId,
            type: 'assigned',
            recipientId: e.id,
            senderId: reporterId,
          };
          notifications.push(notificationForAssigee);
        }
      });
      await Promise.allSettled(promise);
      this.notification.createMany(notifications);
    }
  }
}
