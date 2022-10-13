import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { CreateTodolistDto } from './todolist.dto';
import { TaskService } from '../task/task.service';
@Injectable()
export class TodolistService {
  constructor(
    @InjectRepository(Todolist) private readonly repo: Repository<Todolist>,
    private readonly poolService: PoolService,
    private readonly taskService: TaskService,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findListByUserId(userId: string) {
    const TodoList = await this.repo.findBy({ isActive: true, userId });
    return TodoList;
  }

  async findLastListByUserId(userId: string) {
    const TodoList = await this.repo
      .createQueryBuilder('todolist')
      .where('todolist.isActive = :isActive', { isActive: true })
      .andWhere('todolist.userId = :userId', { userId: userId })
      .orderBy('todolist.createdDate', 'DESC')
      .getOne();
    return TodoList;
  }

  // async create(todoListDto: CreateTodolistDto) {
  //   // console.log(todoListDto.userId);
  //   if (todoListDto.name.trim().length !== 0) {
  //     const todoList = await this.repo.create(todoListDto);
  //     //find UUID unused
  //     const uuid = await this.poolService.findUnuse();
  //     // Set new uuID for this list
  //     todoList.id = uuid.id;
  //     // Mark this uuid is used
  //     await this.poolService.setFlag(uuid.id);
  //     return this.repo.save(todoList);
  //   } else throw new NotAcceptableException('TodoList Name must have at least 1 character');
  // }

  async remove(todoList: Todolist) {
    todoList.isActive = false;
    return this.repo.save(todoList);
  }

  async updateList(todoList: Todolist, listName: string) {
    if (todoList.name.trim().length !== 0) {
      todoList.name = listName;
      return this.repo.save(todoList);
    } else throw new NotAcceptableException('TodoList Name must have at least 1 character');
  }

  async findTodoListByID(id: string) {
    const TodoList = await this.repo.findBy({ id: id, isActive: true });
    return TodoList;
  }

  async findTodoListByName(listName: string) {
    const firstTodoList = await this.repo
      .createQueryBuilder('todolist')
      .where('todolist.listName = :listName', { listName: listName })
      .andWhere('todolist.isActive = :isActive', { isActive: true })
      .getOne();
    return firstTodoList;
  }

  // async resetIndexForAllTask() {
  //   const lists = await this.findAll();
  //   lists.forEach((list) => {
  //     this.taskService.resetOrder(list.id);
  //   });
  //   return 'OK';
  // }
}
