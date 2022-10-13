import { BadRequestException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { TaskService } from '../task/task.service';
import { ICreate, IGetMyList, IUpdate } from './todolist.type';
@Injectable()
export class TodolistService {
  constructor(
    @InjectRepository(Todolist) private readonly repo: Repository<Todolist>,
    private readonly poolService: PoolService,
  ) {}

  async getUserList({ userId }: IGetMyList) {
    const result = await this.repo.findBy({ isActive: true, userId });
    if (!result) return BadRequestException;
    return result;
  }

  async create(body: ICreate) {
    const { id } = await this.poolService.getOne();
    if (!body) return BadRequestException;
    const { name, userId } = body;
    const list = await this.repo.create({ name, userId, id });
    const result = this.repo.save(list);
    if (!result) return BadRequestException;
    this.poolService.use(id);
    return result;
  }

  async update(body: IUpdate) {
    if (!body) return BadRequestException;
    const { isActive, id, name } = body;
    const list = await this.repo.findOneBy({ id });
    if (!list) return MethodNotAllowedException;
    list.isActive = isActive === undefined ? list.isActive : isActive;
    list.name = name === undefined ? list.name : name;
    return this.repo.save(list);
  }
}
