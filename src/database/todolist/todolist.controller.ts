import { Body, Controller, Get, UseGuards, Req, Post, Patch, Param, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateListDto, UpdateListDto } from './todolist.dto';
import { TodolistService } from './todolist.service';

@Controller('lists')
@ApiBearerAuth()
@ApiTags('TodoLists')
export class TodolistController {
  constructor(private readonly todoListService: TodolistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getByUserId(@Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.todoListService.getByUserId({ userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    const result = await this.todoListService.getOne({ id });
    console.log(result instanceof HttpException);

    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() { name }: CreateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.todoListService.create({ name, userId });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() body: UpdateListDto) {
    const result = await this.todoListService.update(body);
    if (result instanceof HttpException) throw result;
    return result;
  }
}