import { Injectable, OnModuleInit, HttpException } from '@nestjs/common';
import { PoolService } from 'src/database/pool/index.service';
import { TaskService } from 'src/database/task/index.service';
import { TodolistService } from 'src/database/todolist/index.service';
import { UserService } from 'src/database/user/index.service';

@Injectable()
export class DevService implements OnModuleInit {
  constructor(
    readonly pool: PoolService,
    readonly user: UserService,
    readonly todolist: TodolistService,
    readonly task: TaskService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV == 'dev') {
      await this.user.repository.save(
        this.user.repository.create({
          id: 'e5563545-053b-4b7e-a046-3b242418f7f5',
          name: 'dev',
          email: 'dev@gmail.com',
        }),
      );
      await this.pool.repository.save(this.pool.repository.create({ id: 'dev', isUsed: false }));
      const todolist = await this.todolist.create({
        name: 'todolist dev',
        userId: 'e5563545-053b-4b7e-a046-3b242418f7f5',
      });
      todolist.id = 'dev';
      await this.todolist.repository.save(todolist);
      let task = await this.task.create({
        name: 'task dev',
        todolistId: 'dev',
        userId: 'e5563545-053b-4b7e-a046-3b242418f7f5',
        description: 'description',
        statusId: 0,
      });
      let i = 0;
      while (task instanceof HttpException) {
        i = i + 1;
        if (i > 10) break;
        task = await this.task.create({
          name: 'task dev',
          todolistId: 'dev',
          userId: 'e5563545-053b-4b7e-a046-3b242418f7f5',
          description: 'description',
          statusId: 0,
        });
      }
      console.log('🚀 ~ file: index.service.ts ~ line 51 ~ DevService ~ onModuleInit ~ task', task);
    }
  }
}
