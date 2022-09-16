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
  BadRequestException,
  UseGuards,
  Headers,
  Req
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { AnyARecord } from 'dns';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TaskService } from 'src/task/task.service';
import {CurrentUser} from 'src/users/decorators/current-user-decorator';
import {User} from 'src/users/entities/user.entity';
import extractHeader from 'src/utils/extract-header';
import { IUser } from 'src/utils/type';
import {CreateTodolistDto} from './dto/create-todolist.dto';
import {TodoListDto} from './dto/todolist.dto';
import {UpdateTodolistDto} from './dto/update-todolist.dto';
import {Todolist} from './entities/todolist.entity';
import {TodolistService} from './todolist.service';
 
interface IQueryParam {
  userId : string;
}

@Controller('lists')
@ApiBearerAuth()
@ApiTags('TodoLists')
export class TodolistController {
    constructor(private todoListService: TodolistService, private taskService: TaskService, private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getListForThisUser(@Req() request: any) {
    const {userId} = extractHeader(request)
    return this.todoListService.findListByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getListName(@Param('id') id: string) {
    const listName = await this.todoListService.findTodoListByID(id).then(result => {
      console.log(result);
      return result;
    });
    if (listName.length === 0) {
      throw new BadRequestException('Cannot find this list 😢');
    }
    const listTask = await this.taskService.findTaskFromListByID(id);
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTodoList(@Body() body: CreateTodolistDto, @Req() request:any) {
    if (body.name.trim().length === 0) {
      throw new BadRequestException('Name not empty')
    }
    const {userId} = extractHeader(request)
    body.userId = userId;
    console.log(body);
    return this.todoListService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    const todoListExisting = await this.todoListService.findTodoListByID(id);
    if (!todoListExisting || todoListExisting[0] === undefined) {
      throw new NotFoundException('Cannot remove list because this list not found 😢');
    }
    console.log(todoListExisting[0]);
    return this.todoListService.remove(todoListExisting[0]);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateList(@Param('id') id: string, @Body() updateTodoListDto: UpdateTodolistDto) {
    const listExisting = await this.todoListService.findTodoListByID(id);
    if (!listExisting[0]) {
      throw new NotFoundException('Cannot update list because list not found 😢');
    }
    if (updateTodoListDto.name.trim().length == 0 ) {
      throw new BadRequestException('Name not empty')
    }
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.name);
  }
}
