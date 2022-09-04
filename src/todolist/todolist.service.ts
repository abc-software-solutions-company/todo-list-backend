import {NotAcceptableException, Injectable, NotFoundException, HttpCode} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Todolist} from './entities/todolist.entity';
import { CreateTodolistDto } from './dto/create-todolist.dto';
@Injectable()
export class TodolistService {
  constructor(@InjectRepository(Todolist) private repo: Repository<Todolist>) {}

  async findAll() {
    const TodoList = await this.repo
    .createQueryBuilder('todolist')
    .where('todolist.isActive = :isActive', {isActive: true})
    .orderBy('todolist.createdDate','DESC')
    .getMany();
    return TodoList;
  }

  async create(todoListDto: CreateTodolistDto) {
    const todoList = await this.repo.create(todoListDto);
    return this.repo.save(todoList);
  }

  async remove(todoList: Todolist) {
    todoList.isActive = false;
    return this.repo.save(todoList);
  }

  async updateList(todoList: Todolist, listName: string) {
    todoList.name = listName;
    return this.repo.save(todoList);
  }

  async findTodoListByID(listId: number) {
    const TodoList = await this.repo
      .createQueryBuilder('todolist')
      .where('todolist.id = :listId', {listId: listId})
      .andWhere('todolist.isActive = :isActive', {isActive: true})
      .getMany();
    return TodoList;
  }

  async findTodoListByName(listName: string) {
    const firstTodoList = await this.repo
      .createQueryBuilder('todolist')
      .where('todolist.listName = :listName', {listName: listName})
      .andWhere('todolist.isActive = :isActive', {isActive: true})
      .getOne();
    return firstTodoList;
  }
}
