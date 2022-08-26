import {NotAcceptableException, Injectable, NotFoundException, HttpCode} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Todolist} from './entities/todolist.entity';
@Injectable()
export class TodolistService {
  constructor(@InjectRepository(Todolist) private repo: Repository<Todolist>) {}

  async findAll(): Promise<Todolist[]> {
    return (await this.repo.find({isActive: true}));
  }

  async create(listName: string): Promise<Todolist> {
    const todoList = this.repo.create({listName});
    return this.repo.save(todoList);
  }

  async remove(todoList: Todolist) {
    todoList.isActive = false;
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
