import {
  NotAcceptableException,
  Injectable,
  NotFoundException,
  HttpCode,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Todolist } from "./entities/todolist.entity";
@Injectable()
export class TodolistService {
  constructor(@InjectRepository(Todolist) private repo: Repository<Todolist>) {}

  async findAll(): Promise<Todolist[]> {
    return this.repo.find();
  }

  async create(list_name: string): Promise<Todolist> {
    const todoList = this.repo.create({ list_name });
    return this.repo.save(todoList);
  }

  async findTodoListByID(listId: number) {
    const TodoList = await this.repo
      .createQueryBuilder("todolist")
      .where("todolist.id = :listId", { listId: listId })
      .getMany();
    return TodoList;
  }

  async findTodoListByName(list_name: string) {
    const firstTodoList = await this.repo
      .createQueryBuilder("todolist")
      .where("todolist.list_name = :list_name", { list_name: list_name })
      .getOne();
    return firstTodoList;
  }
}
