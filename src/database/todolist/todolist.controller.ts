import {
  Body,
  Controller,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Post,
  Patch,
  MethodNotAllowedException,
} from '@nestjs/common';
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
  async getUserList(@Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.todoListService.getUserList({ userId });
    if (!result) throw new BadRequestException();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() { name }: CreateListDto, @Req() request: IRequest) {
    const { id: userId } = request.user;
    const result = await this.todoListService.create({ name, userId });
    if (result === BadRequestException) throw new BadRequestException();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async update(@Body() body: UpdateListDto) {
    const result = await this.todoListService.update(body);
    if (result === BadRequestException) throw new BadRequestException();
    if (result === MethodNotAllowedException) throw new MethodNotAllowedException();
    return result;
  }
}
