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
    const { taskId, identification, isActive = true } = param;

    if (!defineAll(taskId, identification)) throw new BadRequestException('Task-User Set Err Param');
    const oldRecords = await this.repository.find({ where: { taskId, isActive: true } });
    oldRecords.map((e) => {
      e.isActive = false;
      this.repository.save(e);
    });
    const where = identification.map((e) => {
      if (e) {
        return { email: e };
      }
    });
    const users = await this.user.repository.findBy(where);
    const result = users.map((e) => {
      const newTaskUser = this.repository.create({ taskId, userId: e.id, isActive });
      this.repository.save(newTaskUser);
    });
    return result;
  }
}
