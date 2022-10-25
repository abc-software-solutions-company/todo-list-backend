import { Body, Controller, Get, UseGuards, Req, Post, Patch, Param, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateListDto, UpdateListDto } from './todolist.dto';
import { TodolistService } from './todolist.service';

@Controller('lists')
@ApiBearerAuth()
@ApiTags('TodoLists')
export class TodolistController {
  constructor(private readonly service: TodolistService) {}

  @Get('sync')
  @SkipThrottle()
  async sync() {
    return this.service.sync();
  }

  @Get()
  @SkipThrottle()
  async get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @SkipThrottle()
  async getByUser(@Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.service.getByUser({ userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorite')
  @SkipThrottle()
  async getFavorite(@Req() request: IRequest) {
    const { id: userId } = request.user;
    return this.service.getFavorite({ userId });
  }

  @Get(':id')
  @SkipThrottle()
  async getOne(@Param('id') id: string) {
    const result = await this.service.getOne({ id });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() { name }: CreateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.service.create({ name, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() body: UpdateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.service.update({ ...body, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }
}
