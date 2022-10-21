import { BadRequestException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { ICreate, IGetMyList, IGetOne, IUpdate } from './todolist.type';
import { StatusService } from '../status/status.service';
@Injectable()
export class TodolistService {
  constructor(
    @InjectRepository(Todolist) readonly repo: Repository<Todolist>,
    readonly poolService: PoolService,
    readonly statusService: StatusService,
  ) {}

  get() {
    return this.repo.findBy({ isActive: true });
  }

  async getByUserId({ userId }: IGetMyList) {
    const result = await this.repo.findBy({ isActive: true, userId });
    if (!result) return new BadRequestException();
    return result;
  }

  async getOne({ id, userId }: IGetOne) {
    if (!id) return new MethodNotAllowedException();
    const result = await this.repo.findOne({
      where: { id, isActive: true },
      relations: { tasks: true, status: true },
      order: { tasks: { index: 'ASC' } },
    });
    if (!result) return new BadRequestException();
    // As a Private List. Only List owner can view this list
    if (result.visibility === 0 && result.userId !== userId)
      return new BadRequestException('As a Private List. Only List owner can view this list');
    return result;
  }

  async create(body: ICreate) {
    if (!body) return new MethodNotAllowedException();
    const { id } = await this.poolService.getOne();
    const { name, userId } = body;
    if (name.trim().length == 0) return new BadRequestException();
    const listEntity = this.repo.create({ name, userId, id });
    const list = await this.repo.save(listEntity);
    if (!list) return new BadRequestException();
    await this.statusService.init({ todoListId: list.id });
    await this.poolService.use(id);
    return list;
  }

  async update(body: IUpdate) {
    const { isActive, id, name, visibility, userId } = body;
    const list = await this.repo.findOneBy({ id });
    if (!list) return new MethodNotAllowedException();
    // As a readonly list. Only list owner can update.
    if (list.visibility === 1 && list.userId !== userId)
      return new BadRequestException('As a readonly list. Only list owner can update.');
    list.isActive = isActive === undefined ? list.isActive : isActive;
    list.name = name === undefined ? list.name : name;
    list.visibility = visibility === undefined ? list.visibility : visibility;

    return this.repo.save(list);
  }
}
