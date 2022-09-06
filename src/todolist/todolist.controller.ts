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
import { TaskService } from 'src/task/task.service';
import {CurrentUser} from 'src/users/decorators/current-user-decorator';
import {User} from 'src/users/entities/user.entity';
import {CreateTodolistDto} from './dto/create-todolist.dto';
import {TodoListDto} from './dto/todolist.dto';
import {UpdateTodolistDto} from './dto/update-todolist.dto';
import {Todolist} from './entities/todolist.entity';
import {TodolistService} from './todolist.service';

@Controller('lists')
@ApiTags('TodoLists')
export class TodolistController {
  constructor(private todoListService: TodolistService, private taskService: TaskService) {}
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
    const listTask = await this.taskService.findTaskFromListByID(parseInt(id));
    console.log(listTask);
    return {
      "name":listName[0].name,
      "userId" : listName[0].userId,
      "id" : listName[0].id,
      "createdAt" : listName[0].createdDate,
      "updatedAt" : listName[0].updatedDate,
      "tasks": listTask
    }
  }

  @Post()
  async createTodoList(@Body() body: CreateTodolistDto) {
    if (body.name.trim().length === 0) {
      throw new BadRequestException('Name not empty')
    }
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
    if (updateTodoListDto.name.trim().length == 0 ) {
      throw new BadRequestException('Name not empty')
    }
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.name);
  }

  // @Get('/test/')
  // async test() {
  //   const a = {
  //     name: "Thien",
  //     task: ["task 1", "task 2", "task 3"]
  //   }
    
  //   return a;
  // }
}
