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
import {CurrentUser} from 'src/users/decorators/current-user-decorator';
import {User} from 'src/users/entities/user.entity';
import {CreateTodolistDto} from './dto/create-todolist.dto';
import {TodoListDto} from './dto/todolist.dto';
import {UpdateTodolistDto} from './dto/update-todolist.dto';
import {Todolist} from './entities/todolist.entity';
import {TodolistService} from './todolist.service';

@Controller('todos')
@ApiTags('TodoLists')
@Serialize(TodoListDto)
export class TodolistController {
  constructor(private todoListService: TodolistService) {}
  @Get()
  getAllUser() {
    return this.todoListService.findAll();
  }

  @Get('/:id')
  async getListName(@Param('id') id: string) {
    var numberRegex = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;

    if (!numberRegex.test(id)) {
      throw new BadRequestException('Cannot find this list 😢');
    }
    const listName = await this.todoListService.findTodoListByID(parseInt(id)).then(result => {
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
    return this.todoListService.create(body);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: number) {
    const todoListExisting = await this.todoListService.findTodoListByID(id);
    if (!todoListExisting || todoListExisting[0] === undefined) {
      throw new NotFoundException('Cannot remove list because this list not found 😢');
    }
    console.log(todoListExisting[0]);

    return this.todoListService.remove(todoListExisting[0]);
  }

  @Patch('/:id')
  async updateList(@Param('id') id: number, @Body() updateTodoListDto: UpdateTodolistDto) {
    const listExisting = await this.todoListService.findTodoListByID(id);
    if (!listExisting) {
      throw new NotFoundException('Cannot update list because list not found 😢');
    }
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.name);
  }
}
