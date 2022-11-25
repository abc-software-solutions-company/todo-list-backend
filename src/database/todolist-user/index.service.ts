import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { UserService } from '../user/index.service';
import { TodolistUser } from './index.entity';
import { ITodolistUserCreate } from './index.type';

@Injectable()
export class TodolistUserService {
  constructor(
    @InjectRepository(TodolistUser) readonly repository: Repository<TodolistUser>,
    readonly user: UserService,
  ) {}

  async set(param: ITodolistUserCreate) {
    const { todolistId, ids } = param;

    if (!defineAll(todolistId, ids, ...ids)) throw new BadRequestException('Task-User Set Err Param');

    const promises = [];
    const oldMembers = await this.repository.findBy({ todolistId, isActive: true });

    if (oldMembers.length) {
      for (let i = 0; i < oldMembers.length; i++) {
        const member = oldMembers[i];
        member.isActive = false;
        promises.push(this.repository.save(member));
      }
      await Promise.allSettled(promises);
    }

    const where = ids.map((e) => ({ id: e }));
    const newMembers = where.length ? await this.user.repository.findBy(where) : [];
    if (newMembers.length) {
      for (let i = 0; i < newMembers.length; i++) {
        const user = newMembers[i];
        const member = this.repository.create({ todolistId, userId: user.id, isActive: true });
        promises.push(this.repository.save(member));
      }
      await Promise.allSettled(promises);
    }
  }
}
