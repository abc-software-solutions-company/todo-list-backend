import { Body, Controller, Get, UseGuards, Req, Post, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateTodolistDto, SeedListDocDto, SeedListTaskDto, SyncTodolistDto, UpdateTodolistDto } from './index.dto';
import { TodolistService } from './index.service';

@Controller('todolists')
@ApiBearerAuth()
@ApiTags('TodoList')
export class TodolistController {
  constructor(private readonly service: TodolistService) {}

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
    return this.service.getAll({ userId });
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
  create(@Body() { name, taskSymbol, member, visibility }: CreateTodolistDto, @Req() request: IRequest) {
    const { id: userId, email } = request.user;
    return this.service.create({ name, taskSymbol, userId, email, member, visibility });
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

  @UseGuards(JwtAuthGuard)
  @Post('/seedTask')
  seedListTask(@Body() body: SeedListTaskDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.seedListTask({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/seedDoc')
  seedListDoc(@Body() body: SeedListDocDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.seedListDoc({ ...body, userId });
  }
}
