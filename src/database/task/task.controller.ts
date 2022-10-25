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
  constructor(private readonly service: TaskService) {}

  // @Get('/sync')
  // @SkipThrottle()
  // async sync() {
  //   return this.service.sync();
  // }

  @Get()
  @SkipThrottle()
  async get() {
    return this.service.get();
  }

  @Get(':id')
  @SkipThrottle()
  async getOne(@Param('id') id: string) {
    return this.service.getOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.service.create({ ...body, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Body() body: UpdateTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.service.update({ ...body, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/reIndex')
  async reIndex(@Body() body: ReIndexDto, @Req() request: IRequest) {
    const { id: userId } = request.user;

    const result = await this.service.reIndex({ ...body, userId });
    if (result instanceof HttpException) throw result;
  }
}
