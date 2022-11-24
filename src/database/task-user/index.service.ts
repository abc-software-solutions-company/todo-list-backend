import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { UserService } from '../user/index.service';
import { TaskUser } from './index.entity';
import { ITaskUserCreate } from './index.type';

@Injectable()
export class TaskUserService {
  constructor(@InjectRepository(TaskUser) readonly repository: Repository<TaskUser>, readonly user: UserService) {}

  async set(param: ITaskUserCreate) {
    console.log('🚀 ~ file: index.service.ts ~ line 14 ~ TaskUserService ~ set ~ param', param);
    const { taskId, emails } = param;

    if (!defineAll(taskId, emails, ...emails)) throw new BadRequestException('Task-User Set Err Param');
    const oldAssignees = await this.repository.findBy({ taskId, isActive: true });
    if (oldAssignees.length) {
      const promise = [];
      oldAssignees.map((e) => {
        e.isActive = false;
        promise.push(this.repository.save(e));
      });
      await Promise.allSettled(promise);
    }
    if (emails.length) {
      const promise = [];
      const where = emails.map((e) => ({ email: e }));
      const users = await this.user.repository.findBy(where);
      users.map((e) => {
        const newAssignee = this.repository.create({ taskId, userId: e.id, isActive: true });
        promise.push(this.repository.save(newAssignee));
      });
      await Promise.allSettled(promise);
    }
  }
}
