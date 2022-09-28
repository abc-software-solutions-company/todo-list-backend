import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Req,
  Catch,
  NotAcceptableException,
  UnauthorizedException
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TaskService } from 'src/task/task.service';
import { UsersService } from 'src/users/users.service';
import extractHeader from 'src/utils/extract-header';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {CreateTodolistDto} from './dto/create-todolist.dto';
import {UpdateTodolistDto} from './dto/update-todolist.dto';
import {TodolistService} from './todolist.service';

@Controller('lists')
@ApiBearerAuth()
@ApiTags('TodoLists')
@Catch(QueryFailedError, EntityNotFoundError)
export class TodolistController {
    constructor(private todoListService: TodolistService, private taskService: TaskService, private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getListForThisUser(@Req() request: any) {
    const {userId} = extractHeader(request)
    if (this.userService.checkUnAuthorized(userId)) throw new UnauthorizedException('😓 This account doesn"t exist ');
    return this.todoListService.findListByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/query/last')
  async getLastListForThisUser(@Req() request: any) {
    const {userId} = extractHeader(request)
    if (this.userService.checkUnAuthorized(userId)) throw new UnauthorizedException('😓 This account doesn"t exist ');
    const lastList = await this.todoListService.findLastListByUserId(userId)
    if (lastList) return lastList
    else throw new NotFoundException('Not found list');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getListName(@Param('id') id: string) {
    const listName = await this.todoListService.findTodoListByID(id).then(result => {
      // console.log(result);
      return result;
    });
    if (listName.length === 0) {
      throw new NotFoundException('Cannot find this list 😢');
    }
    const listTask = await this.taskService.findTaskFromListByID(id);
    // console.log(listTask);
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
      throw new NotAcceptableException('Name not empty')
    }
    const {userId} = extractHeader(request)
    if (this.userService.checkUnAuthorized(userId)) throw new UnauthorizedException('😓 This account doesn"t exist ');
    body.userId = userId;
    // console.log(body);
    return this.todoListService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeList(@Param('id') id: string) {
    const todoListExisting = await this.todoListService.findTodoListByID(id);
    if (!todoListExisting || todoListExisting[0] === undefined) {
      throw new NotFoundException('Cannot remove list because this list not found 😢');
    }
    // console.log(todoListExisting[0]);
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
      throw new NotAcceptableException('Name not empty')
    }
    return this.todoListService.updateList(listExisting[0], updateTodoListDto.name);
  }
}
