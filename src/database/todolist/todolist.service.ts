import { BadRequestException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { ICreate, IGetMyList, IGetOne, IUpdate } from './todolist.type';
@Injectable()
export class TodolistService {
  constructor(@InjectRepository(Todolist) private readonly repo: Repository<Todolist>, private readonly poolService: PoolService) {}

  async getByUserId({ userId }: IGetMyList) {
    const result = await this.repo.findBy({ isActive: true, userId });
    if (!result) return new BadRequestException();
    return result;
  }

  async getOne({ id }: IGetOne) {
    if (!id) return MethodNotAllowedException;
    const result = await this.repo.findOne({ where: { id }, relations: { tasks: true } });
    if (!result) return new BadRequestException();
    return result;
  }

  async create(body: ICreate) {
    if (!body) return new MethodNotAllowedException();
    const { id } = await this.poolService.getOne();
    const { name, userId } = body;
    if (name.trim().length == 0) return new BadRequestException();
    const list = await this.repo.create({ name, userId, id });
    const result = this.repo.save(list);
    if (!result) return new BadRequestException();
    this.poolService.use(id);
    return result;
  }

  async update(body: IUpdate) {
    const { isActive, id, name } = body;
    const list = await this.repo.findOneBy({ id });
    if (!list) return new MethodNotAllowedException();
    list.isActive = isActive === undefined ? list.isActive : isActive;
    list.name = name === undefined ? list.name : name;
    return this.repo.save(list);
  }
}
