import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {CreateTodolistDto} from './dto/create-todolist.dto';
import {TodoListDto} from './dto/todolist.dto';
import {Todolist} from './entities/todolist.entity';
import {TodolistService} from './todolist.service';

@Controller('todo-lists')
@ApiTags('TodoLists')
@Serialize(TodoListDto)
export class TodolistController {
  constructor(private todoListService: TodolistService) {}
  @Get()
  getAllUser(): Promise<Todolist[]> {
    return this.todoListService.findAll();
  }

  @Get('/:listID')
  async getListName(@Param('listID') listID: number) {
    console.log(listID);
    
    const listName = await this.todoListService.findTodoListByID(listID).then(result => {
      console.log(result);
      return result;
    });
    if (listName.length === 0) {
      throw new BadRequestException('Cannot find this list');
    }
    return listName[0];
  }

  @Post()
  async createUser(@Body() body: CreateTodolistDto) {
    const existTodoList = await this.todoListService.findTodoListByName(body.listName).then(result => {
      return result;
    });

    if (existTodoList !== undefined) {
      throw new BadRequestException('This TodoList already existing');
    }
    return this.todoListService.create(body.listName);
  }

  @Delete('/:listID')
  async removeUser(@Param('listID') listID: number) {
    const todoListExisting = await this.todoListService.findTodoListByID(listID);
    if (!todoListExisting) {
      throw new NotFoundException('Cannot remove list because this list not found');
    }
    console.log(todoListExisting[0]);

    return this.todoListService.remove(todoListExisting[0]);
  }
}
