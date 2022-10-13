import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { TaskService } from '../task/task.service';
import { ICreate, IGetMyList } from './todolist.type';
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

  async getUserList({ userId }: IGetMyList) {
    const result = await this.repo.findBy({ isActive: true, userId });
    if (!result) return BadRequestException;
    return result;
  }

  async create({ name, userId }: ICreate) {
    return console.log('ok');
  }

  // async create(ListDto: CreateListDto) {
  //   // console.log(ListDto.userId);
  //   if (ListDto.name.trim().length !== 0) {
  //     const todoList = await this.repo.create(ListDto);
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
