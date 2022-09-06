import { Module } from "@nestjs/common";
import { TodolistService } from "./todolist.service";
import { TodolistController } from "./todolist.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todolist } from "./entities/todolist.entity";
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todolist, Task])],
  controllers: [TodolistController],
  providers: [TodolistService, TaskService],
})
export class TodolistModule {}
