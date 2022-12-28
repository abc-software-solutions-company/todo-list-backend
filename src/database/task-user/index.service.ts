import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/index.service';
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
      const promise = [];
      const where = ids.map((e) => ({ id: e }));
      const users = await this.user.repository.findBy(where);

      const assignorName = `<span style="font-weight: 600;">${assignor.name}</span>`;
      const link = `<a href="/tasks/${taskId}">${taskName}</a>`;

      users.map((e) => {
        const newAssignee = this.repository.create({ taskId, userId: e.id, isActive: true });

        promise.push(this.repository.save(newAssignee));
        if (assignorId !== reporterId && assignorId === e.id) {
          promise.push(
            this.notification.create({
              content: `${assignorName} assigned you to the task ${link} to ${assignorName}`,
              link: taskId,
              type: 'task',
              recipientID: reporterId,
              senderID: assignor.id,
            }),
          );
        } else {
          promise.push(
            this.notification.create({
              content: `${assignorName} assigned you to the task ${link} to you`,
              link: taskId,
              type: 'task',
              recipientID: e.id,
              senderID: reporterId,
            }),
          );
        }
      });
      await Promise.allSettled(promise);
    }
  }
}
