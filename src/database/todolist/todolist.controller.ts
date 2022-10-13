import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  NotAcceptableException,
  BadRequestException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { TaskService } from '../task/task.service';
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
  }

  // @Get('/:id')
  // async getListDetail(@Param('id') id: string) {
  //   const listName = await this.todoListService.findTodoListByID(id).then((result) => {
  //     return result;
  //   });
  //   if (listName.length === 0) throw new NotFoundException('Cannot find this list 😢');
  //   const listTask = await this.taskService.findTaskFromListByID(id);
  //   return {
  //     name: listName[0].name,
  //     userId: listName[0].userId,
  //     id: listName[0].id,
  //     createdAt: listName[0].createdDate,
  //     updatedAt: listName[0].updatedDate,
  //     tasks: listTask,
  //   };
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async createTodoList(@Body() body: CreateListDto, @Req() request: IRequest) {
  //   if (body.name.trim().length === 0) throw new NotAcceptableException('Name not empty');
  //   body.userId = request.user.id;
  //   return this.todoListService.create(body);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete('/:id')
  // async removeUser(@Param('id') id: string, @Req() request: IRequest) {
  //   const todoListExisting = await this.todoListService.findTodoListByID(id);
  //   if (!todoListExisting || todoListExisting[0] === undefined) throw new NotFoundException('Not found list 😢');

  //   const checkListOwner = await this.todoListService.findListByUserId(request.user.id);
  //   if (checkListOwner.length == 0) throw new NotFoundException('Cannot remove list you are not owner 😢');
  //   return this.todoListService.remove(todoListExisting[0]);
  // }

  // @Patch('/resetIndex')
  // resetIndex() {
  //   return this.todoListService.resetIndexForAllTask();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Patch('/:id')
  // async updateList(@Param('id') id: string, @Body() UpdateListDto: UpdateListDto) {
  //   const listExisting = await this.todoListService.findTodoListByID(id);
  //   if (!listExisting[0]) throw new NotFoundException('Not found list 😢');
  //   if (UpdateListDto.name.trim().length == 0) throw new NotAcceptableException('Name not empty');
  //   return this.todoListService.updateList(listExisting[0], UpdateListDto.name);
  // }
}
