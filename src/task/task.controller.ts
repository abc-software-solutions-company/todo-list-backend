import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { TodolistService } from "src/todolist/todolist.service";
import { UsersService } from "src/users/users.service";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { TaskDto } from "./dto/task.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { CurrentUser } from "src/users/decorators/current-user-decorator";
import { User } from "src/users/entities/user.entity";
import { CurrentTodoList } from "src/todolist/decorators/current-todolist-decorator";
import { Todolist } from "src/todolist/entities/todolist.entity";
import { UpdateTaskDto } from "./dto/update-task-dto";

@ApiTags("Task")
@Controller("task")
@Serialize(TaskDto)
export class TasksController {
  constructor(
    private taskService: TaskService,
    private todoListService: TodolistService,
    private userService: UsersService
  ) {}

  @Get("/read/:listID")
  readTodoListByID(@Param("listID") listID: number) {
    return this.taskService.findTaskFromLitByID(listID);
  }

  @Post("/create-task")
  async createTask(
    @Body() body: CreateTaskDto,
    @CurrentUser() user: User,
    @CurrentTodoList() todoList: Todolist
  ) {
    const existTask = await this.taskService
      .findTaskByName(body.task_name)
      .then((result) => {
        return result;
      });
    if (existTask !== undefined) {
      throw new BadRequestException("This task already existing");
    }

    const existTodoList = await this.todoListService
      .findTodoListByID(body.todolistId)
      .then((result) => {
        return result;
      });
    if (existTodoList.length == 0) {
      throw new BadRequestException("Error your list id is not available");
    }

    const existUser = await this.userService
      .findUserById(body.userId)
      .then((result) => {
        return result;
      });
    if (existUser === undefined) {
      throw new BadRequestException("Error you user id is not available");
    }

    console.log(existTodoList.length);

    return this.taskService.create(body, todoList, user);
  }

  @Delete("/remove-task/:id")
  async removeUser(@Param("id") id: string) {
    const taskExisting = await this.taskService.findTaskById(id);
    if (!taskExisting) {
      throw new NotFoundException("Cannot remove task because task not found");
    }
    return this.taskService.remove(taskExisting);
  }

  @Patch("/update-task/")
  async updateTask(@Body() updateTaskDto: UpdateTaskDto) {
    const taskExisting = await this.taskService.findTaskById(updateTaskDto.id);
    if (!taskExisting) {
      throw new NotFoundException("Cannot update task because task not found");
    }
    return this.taskService.updateTask(taskExisting, updateTaskDto.task_name);
  }
}
