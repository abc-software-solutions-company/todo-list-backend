import { Controller, UseGuards, Get, Param, Post, Body, Req, Patch, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateTaskDto, ReIndexDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:todoListId')
  @SkipThrottle()
  async getByListId(@Param('todoListId') todoListId: string) {
    const result = await this.taskService.getByListId({ todoListId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.taskService.create({ ...body, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Body() body: UpdateTaskDto) {
    const result = await this.taskService.update(body);
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/reIndex')
  async reIndex(@Body() body: ReIndexDto) {
    const result = await this.taskService.reIndex(body);
    if (result instanceof HttpException) throw result;
  }
}
