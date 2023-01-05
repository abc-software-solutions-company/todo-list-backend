import { Body, Controller, Get, UseGuards, Req, Post, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { StatusService } from '../status/index.service';
import { CreateTodolistDto, SyncTodolistDto, UpdateTodolistDto } from './index.dto';
import { TodolistService } from './index.service';
import { ReindexAllDto } from './index.type';

@Controller('todolists')
@ApiBearerAuth()
@ApiTags('TodoList')
export class TodolistController {
  constructor(private readonly service: TodolistService, private readonly status: StatusService) {}

  @Get()
  @SkipThrottle()
  get() {
    return this.service.get();
  }

  @Get('seo/:id')
  @SkipThrottle()
  seo(@Param('id') id: string) {
    return this.service.seoOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @SkipThrottle()
  getByUser(@Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.getByUser({ userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorite')
  @SkipThrottle()
  getFavorite(@Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.getFavorite({ userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tasks')
  @SkipThrottle()
  getMyTask(@Req() request: IRequest) {
    const userId = request.user.id;
    return this.service.getMyTasks({ userId });
  }

  @Get('assign-index-column')
  @SkipThrottle()
  assignIndexColumn() {
    return this.service.assignIndexColumn();
  }

  @UseGuards(JwtAuthGuard)
  @Get('board/:id')
  @SkipThrottle()
  getOneKanban(@Param('id') id: string, @Req() request: IRequest) {
    const userId = request.user.id;
    return this.service.getOneKanban({ id, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @SkipThrottle()
  getOne(@Param('id') id: string, @Req() request: IRequest) {
    const userId = request.user.id;
    return this.service.getOne({ id, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() { name }: CreateTodolistDto, @Req() request: IRequest) {
    const { id: userId, email } = request.user;
    return this.service.create({ name, userId, email });
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: UpdateTodolistDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.update({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/sync')
  syncTodolist(@Body() body: SyncTodolistDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.sync({ ...body, userId });
  }
}
