import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModule } from '../image/image.module';
import { TaskImageModule } from '../taskImage/taskImage.module';
import { TodolistModule } from '../todolist/todolist.module';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TodolistModule, TaskImageModule, ImageModule, AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TasksModule {}
