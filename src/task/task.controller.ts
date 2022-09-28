import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  Put,
  UseGuards,
  Req,
  Catch,
  ForbiddenException,
  NotAcceptableException,
  UnauthorizedException
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {TaskService} from './task.service';
import {TodolistService} from 'src/todolist/todolist.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {CurrentTodoList} from 'src/todolist/decorators/current-todolist-decorator';
import {Todolist} from 'src/todolist/entities/todolist.entity';
import {UpdateTaskDto} from './dto/update-task-dto';
import {JwtAuthGuard} from 'src/auth/guards/jwt-auth.guard';
import extractHeader from 'src/utils/extract-header';
import {EntityNotFoundError, QueryFailedError, TypeORMError} from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@Catch(QueryFailedError, EntityNotFoundError, TypeORMError)
export class TasksController {
  constructor(private taskService: TaskService, private todoListService: TodolistService, private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:listID')
  async readTodoListByID(@Param('listID') listID: string,@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    try {
      return this.taskService.findTaskFromListByID(listID);
    } catch {
      throw new NotFoundException('😓😓Cannot find task from this list');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/single/:id')
  async getTaskById(@Param('id') id: string,@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    return this.taskService.findTaskById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Body() body: CreateTaskDto, @CurrentTodoList() todoList: Todolist, @Req() request: any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    const existTodoList = await this.todoListService.findTodoListByID(body.todoListId).then(result => {
      return result;
    });
    if (existTodoList.length == 0) {
      throw new NotFoundException('Error your list id is not available 😢');
    }
    if (body.name.trim().length == 0) {
      throw new NotAcceptableException('Name not empty');
    }
    body.userId = userId;
    return this.taskService.create(body, todoList);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string,@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    try {
      const taskExisting = await this.taskService.findTaskById(id);
      return this.taskService.remove(taskExisting);
    } catch {
      throw new NotFoundException('Cannot remove task because task not found 😢');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async markTaskDone(@Param('id') id: string,@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    try {
      const taskExisting = await this.taskService.findTaskById(id);
      if (!taskExisting) {
        throw new NotFoundException('Cannot mark done this task because task not found 😢😭😭😭😭😭');
      }
      return this.taskService.markTaskDone(taskExisting);
    } catch {
      throw new NotFoundException('Cannot mark done this task because task not found ');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto,@Req() request:any) {
    const {userName,userId} = extractHeader(request);
    if (await this.authService.validateUser(userName,userId)===null) throw new UnauthorizedException('❌❌❌❌❌')
    if (updateTaskDto.name.trim().length == 0) {
      throw new NotAcceptableException('Name not empty');
    } else
    try {
      const taskExisting = await this.taskService.findTaskById(id);
      return this.taskService.updateTask(taskExisting, updateTaskDto.name);
    } catch {
      throw new NotFoundException('Cannot update task because task not found 😢');
    }
  }
}
