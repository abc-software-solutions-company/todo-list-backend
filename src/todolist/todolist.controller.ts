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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CreateTodolistDto } from "./dto/create-todolist.dto";
import { TodoListDto } from "./dto/todolist.dto";
import { Todolist } from "./entities/todolist.entity";
import { TodolistService } from "./todolist.service";

@Controller("todolist")
@ApiTags("TodoList")
@Serialize(TodoListDto)
export class TodolistController {
  constructor(private todoListService: TodolistService) {}
  @Get("/get-all")
  getAllUser(): Promise<Todolist[]> {
    return this.todoListService.findAll();
  }

  @Post("/create")
  async createUser(@Body() body: CreateTodolistDto) {
    const existTodoList = await this.todoListService
      .findTodoListByName(body.list_name)
      .then((result) => {
        return result;
      });

    if (existTodoList !== undefined) {
      throw new BadRequestException("This TodoList already existing");
    }
    this.todoListService.create(body.list_name);
  }
}
