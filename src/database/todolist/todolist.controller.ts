import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  NotAcceptableException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { TaskService } from '../task/task.service';
import { CreateTodolistDto, UpdateTodolistDto } from './todolist.dto';
import { TodolistService } from './todolist.service';

@Controller('lists')
@ApiBearerAuth()
@ApiTags('TodoLists')
export class TodolistController {
  constructor(private readonly todoListService: TodolistService, private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getListForThisUser(@Req() { user: { id } }: IRequest) {
    return this.todoListService.findListByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/query/last')
  async getLastListForThisUser(@Req() { user: { id } }: IRequest) {
    const lastList = await this.todoListService.findLastListByUserId(id);
    if (lastList) return lastList;
    else throw new NotFoundException('Not found list');
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/query/all')
  async getAllList() {
    return this.todoListService.findAll();
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
  // async createTodoList(@Body() body: CreateTodolistDto, @Req() request: IRequest) {
  //   if (body.name.trim().length === 0) throw new NotAcceptableException('Name not empty');
  //   body.userId = request.user.id;
  //   return this.todoListService.create(body);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string, @Req() request: IRequest) {
    const todoListExisting = await this.todoListService.findTodoListByID(id);
    if (!todoListExisting || todoListExisting[0] === undefined) throw new NotFoundException('Not found list 😢');

    const checkListOwner = await this.todoListService.findListByUserId(request.user.id);
    if (checkListOwner.length == 0) throw new NotFoundException('Cannot remove list you are not owner 😢');
    return this.todoListService.remove(todoListExisting[0]);
  }

  // @Patch('/resetIndex')
  // resetIndex() {
  //   return this.todoListService.resetIndexForAllTask();
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateList(@Param('id') id: string, @Body() updateTodoListDto: UpdateTodolistDto) {
    const listExisting = await this.todoListService.findTodoListByID(id);
    if (!listExisting[0]) throw new NotFoundException('Not found list 😢');
    if (updateTodoListDto.name.trim().length == 0) throw new NotAcceptableException('Name not empty');
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.name);
  }
}
