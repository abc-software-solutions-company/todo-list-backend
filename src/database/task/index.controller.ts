import { Controller, UseGuards, Get, Param, Post, Body, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateTaskDto, ReIndexDto, UpdateTaskDto } from './index.dto';
import { TaskService } from './index.service';

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
  create(@Body() body: CreateTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.create({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  update(@Body() body: UpdateTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.update({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/reindex')
  reIndex(@Body() body: ReIndexDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.reindex({ ...body, userId });
  }
}
