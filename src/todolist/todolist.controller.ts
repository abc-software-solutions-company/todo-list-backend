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
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import {Todolist} from './entities/todolist.entity';
import {TodolistService} from './todolist.service';

@Controller('todo-lists')
@ApiTags('TodoLists')
@Serialize(TodoListDto)
export class TodolistController {
  constructor(private todoListService: TodolistService) {}
  @Get()
  getAllUser() {
    return this.todoListService.findAll();
  }

  @Get('/:listID')
  async getListName(@Param('listID') listID: string) {
    var numberRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;

    if (!numberRegex.test(listID)) {
      throw new BadRequestException('Cannot find this list 😢');
    }
    const listName = await this.todoListService.findTodoListByID(parseInt(listID)).then(result => {
      console.log(result);
      return result;
    });
    if (listName.length === 0) {
      throw new BadRequestException('Cannot find this list 😢');
    }
    return listName[0];
  }

  @Post()
  async createUser(@Body() body: CreateTodolistDto) {
    return this.todoListService.create(body.listName);
  }

  @Delete('/:listID')
  async removeUser(@Param('listID') listID: number) {
    const todoListExisting = await this.todoListService.findTodoListByID(listID);
    if (!todoListExisting || todoListExisting[0] === undefined) {
      throw new NotFoundException('Cannot remove list because this list not found 😢');
    }
    console.log(todoListExisting[0]);

    return this.todoListService.remove(todoListExisting[0]);
  }

  @Patch("/:listID")
  async updateList(@Param("listID") listID: number,@Body() updateTodoListDto: UpdateTodolistDto) {
    const listExisting = await this.todoListService.findTodoListByID(listID);
    if (!listExisting) {
      throw new NotFoundException("Cannot update list because list not found 😢");
    }
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.listName);
  }
}
