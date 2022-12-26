import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { defineAll } from 'src/utils/function';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/index.service';
import { UserService } from '../user/index.service';
import { TodolistUser } from './index.entity';
import { ITodolistUserCreate } from './index.type';

@Injectable()
export class TodolistUserService {
  constructor(
    @InjectRepository(TodolistUser) readonly repository: Repository<TodolistUser>,
    readonly notification: NotificationService,
    readonly user: UserService,
  ) {}

  async set(param: ITodolistUserCreate) {
    const { todolistId, nameOfTodolist, ownerId, ids } = param;

    if (!defineAll(todolistId, ownerId, ids, ...ids)) throw new BadRequestException('Task-User Set Err Param');

    const owner = await this.user.repository.findOneBy({ id: ownerId });

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
        console.log(user.id);
        console.log(owner.id);
        const member = this.repository.create({ todolistId, userId: user.id, isActive: true });
        if (user.id !== owner.id) {
          this.notification.create({
            content: `${owner.name} invited you in a list task ${nameOfTodolist}`,
            link: todolistId,
            type: 'todolist',
            recipientID: user.id,
            senderID: owner.id,
          });
        }
        promises.push(this.repository.save(member));
      }
      await Promise.allSettled(promises);
    }
  }
}
