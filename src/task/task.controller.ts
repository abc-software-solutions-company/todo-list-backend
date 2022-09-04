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
  Put,
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

@ApiTags("Tasks")
@Controller("tasks")
@Serialize(TaskDto)
export class TasksController {
  constructor(
    private taskService: TaskService,
    private todoListService: TodolistService,
    private userService: UsersService
  ) {}

  @Get("/:id")
  getTaskById(@Param("id") id: string) {
    return this.taskService.findTaskById(id);
  }

  @Get("/:listID")
  readTodoListByID(@Param("listID") listID: number) {
    return this.taskService.findTaskFromListByID(listID);
  }

  @Post()
  async createTask(
    @Body() body: CreateTaskDto,
    @CurrentUser() user: User,
    @CurrentTodoList() todoList: Todolist
  ) {
    const existTodoList = await this.todoListService
      .findTodoListByID(body.todolistId)
      .then((result) => {
        return result;
      });
    if (existTodoList.length == 0) {
      throw new BadRequestException("Error your list id is not available 😢");
    }

    return this.taskService.create(body, todoList);
  }

  @Delete("/:id")
  async removeUser(@Param("id") id: string) {
    const taskExisting = await this.taskService.findTaskById(id);
    if (!taskExisting) {
      throw new NotFoundException("Cannot remove task because task not found 😢");
    }
    return this.taskService.remove(taskExisting);
  }

  @Put("/:id")
  async markTaskDone(@Param("id") id: string) {
    const taskExisting = await this.taskService.findTaskById(id);
    if (!taskExisting) {
      throw new NotFoundException("Cannot mark done this task because task not found 😢😭😭😭😭😭");
    }
    return this.taskService.markTaskDone(taskExisting);
  }

  @Patch("/:id")
  async updateTask(@Param("id") id: string,@Body() updateTaskDto: UpdateTaskDto) {
    const taskExisting = await this.taskService.findTaskById(id);
    if (!taskExisting) {
      throw new NotFoundException("Cannot update task because task not found 😢");
    }
    return this.taskService.updateTask(taskExisting, updateTaskDto.name);
  }
}
