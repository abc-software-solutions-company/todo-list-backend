import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/index.module';
import { AttachmentModule } from '../attachment/index.module';
import { CommentModule } from '../comment/index.module';
import { NotificationModule } from '../notification/index.module';
import { StatusModule } from '../status/index.module';
import { TaskUserModule } from '../task-user/index.module';
import { TodolistModule } from '../todolist/index.module';
import { UserModule } from '../user/index.module';
import { TaskController } from './index.controller';
import { Task } from './index.entity';
import { TaskService } from './index.service';
import { TodolistUserModule } from '../todolist-user/index.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => TodolistModule),
    CommentModule,
    AttachmentModule,
    NotificationModule,
    TaskUserModule,
    TodolistUserModule,
    StatusModule,
    AuthModule,
    UserModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
