import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './index.entity';
import { PoolService } from 'src/database/pool/index.service';
import { ICreate, IGetMyList, IGetOne, IUpdate } from './index.type';
import { StatusService } from '../status/index.service';
@Injectable()
export class TodolistService {
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };

  constructor(
    @InjectRepository(Todolist) readonly repository: Repository<Todolist>,
    readonly poolService: PoolService,
    readonly statusService: StatusService,
  ) {}

  get() {
    return this.repository.findBy({ isActive: true });
  }

  async getByUser({ userId }: IGetMyList) {
    const result = await this.repository.find({
      where: { isActive: true, userId },
      relations: { favorites: true },
      order: { createdDate: 'ASC' },
    });
    if (!result) throw new BadRequestException();
    return result;
  }

  getFavorite({ userId }: IGetMyList) {
    return this.repository.find({
      where: { isActive: true, favorites: { userId, isActive: true } },
      relations: { favorites: true },
      order: { favorites: { updatedDate: 'ASC' } },
    });
  }

  async getOne({ id }: IGetOne) {
    if (!id) throw new MethodNotAllowedException();
    const result = await this.repository.findOne({
      where: { id, isActive: true },
      relations: { tasks: true, status: true, favorites: true },
      order: { tasks: { index: 'ASC' } },
    });
    if (!result) throw new BadRequestException();
    return result;
  }

  async create(param: ICreate) {
    const { name } = param;
    if (!name.trim()) throw new MethodNotAllowedException('Empty name');
    const { id } = await this.poolService.use();
    const visibility = this.visibilityList.public;
    const todolistEntity = this.repository.create({ ...param, id, visibility });
    const todolist = await this.repository.save(todolistEntity);
    await this.statusService.init({ todolistId: todolist.id });
    return todolist;
  }

  async update(body: IUpdate) {
    const { id, name, isActive, visibility, userId } = body;
    if (!id) throw new BadRequestException();
    const todolist = await this.repository.findOneBy({ id });
    if (todolist.userId !== userId) throw new ForbiddenException();
    if (!todolist) throw new MethodNotAllowedException();

    if (name && name.trim()) {
      todolist.name = name;
    }

    if (isActive !== undefined) {
      todolist.isActive = isActive;
    }

    if (visibility) {
      if (!Object.values(this.visibilityList).includes(visibility)) throw new BadRequestException('visibility error');
      todolist.visibility = visibility;
    }

    return this.repository.save(todolist);
  }
}
