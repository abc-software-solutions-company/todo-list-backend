import { Controller, UseGuards, Get, Param, Post, Body, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateTaskDto, FindOrtherTasksDto, ReindexAllDto, UpdateTaskDto } from './index.dto';
import { TaskService } from './index.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

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
  create(@Body() body: CreateTaskDto, @Req() { user: { id: userId } }: IRequest) {
    return this.service.create({ ...body, userId });
  }

  @Post('find-orther-tasks')
  @SkipThrottle()
  async findOrtherTasks(@Body() findOrtherTaskDto: FindOrtherTasksDto) {
    return this.service.findOrtherTasks(findOrtherTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: UpdateTaskDto, @Req() { user: { id: userId } }: IRequest) {
    return this.service.update({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/reindex-all')
  reindexAll(@Body() body: ReindexAllDto) {
    return this.service.reindexAll({ ...body });
  }
}
