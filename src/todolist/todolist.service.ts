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

  async create(listName: string): Promise<Todolist> {
    const todoList = this.repo.create({ listName });
    return this.repo.save(todoList);
  }

  async remove(todoList: Todolist) {
    return this.repo.remove(todoList);
  }

  async findTodoListByID(listId: number) {
    const TodoList = await this.repo
      .createQueryBuilder("todolist")
      .where("todolist.id = :listId", { listId: listId })
      .getMany();
    return TodoList;
  }

  async findTodoListByName(listName: string) {
    const firstTodoList = await this.repo
      .createQueryBuilder("todolist")
      .where("todolist.listName = :listName", { listName: listName })
      .getOne();
    return firstTodoList;
  }
}
