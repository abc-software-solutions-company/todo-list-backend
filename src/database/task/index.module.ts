import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/index.module';
import { AttachmentModule } from '../attachment/index.module';
import { CommentModule } from '../comment/index.module';
import { TodolistModule } from '../todolist/index.module';
import { UserModule } from '../user/index.module';
import { TaskController } from './index.controller';
import { Task } from './index.entity';
import { TaskService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TodolistModule, CommentModule, AttachmentModule, UserModule, AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
