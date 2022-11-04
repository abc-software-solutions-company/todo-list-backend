import { Body, Controller, Get, UseGuards, Req, Post, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateListDto, UpdateListDto } from './index.dto';
import { TodolistService } from './index.service';

@Controller('todolists')
@ApiBearerAuth()
@ApiTags('TodoList')
export class TodolistController {
  constructor(private readonly service: TodolistService) {}

  @Get()
  @SkipThrottle()
  async get() {
    return this.service.get();
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

  @Get(':id')
  @SkipThrottle()
  getOne(@Param('id') id: string) {
    return this.service.getOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() { name }: CreateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.create({ name, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: UpdateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.update({ ...body, userId });
  }
}
