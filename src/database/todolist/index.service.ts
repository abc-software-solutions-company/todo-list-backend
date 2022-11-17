import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './index.entity';
import { PoolService } from 'src/database/pool/index.service';
import { ITodolistCreate, ITodolistGetMyList, ITodolistGetOne, ITodolistUpdate } from './index.type';
import { StatusService } from '../status/index.service';
import { FavoriteService } from '../favorite/index.service';
import { defineAny } from 'src/utils/function';
@Injectable()
export class TodolistService {
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };

  constructor(
    @InjectRepository(Todolist) readonly repository: Repository<Todolist>,
    readonly poolService: PoolService,
    readonly statusService: StatusService,
    readonly favoriteService: FavoriteService,
  ) {}

  get() {
    return this.repository.findBy({ isActive: true });
  }

  async getByUser({ userId }: ITodolistGetMyList) {
    const result = await this.repository.find({
      where: { isActive: true, userId },
      relations: { favorites: true },
      order: { createdDate: 'ASC' },
    });
    if (!result) throw new BadRequestException();
    return result;
  }

  getFavorite({ userId }: ITodolistGetMyList) {
    return this.repository.find({
      where: { isActive: true, favorites: { userId, isActive: true } },
      relations: { favorites: true },
      order: { favorites: { updatedDate: 'ASC' } },
    });
  }

  async getOne({ id }: ITodolistGetOne) {
    if (!id) throw new MethodNotAllowedException();
    const result = await this.repository.findOne({
      where: { id, isActive: true },
      relations: { tasks: { status: true }, status: { tasks: true }, favorites: true },
      order: { tasks: { index: 'ASC' }, status: { index: 'ASC' } },
    });
    return result;
  }

  async create(param: ITodolistCreate) {
    const { name } = param;
    if (!name || (name && !name.trim())) throw new MethodNotAllowedException('Empty name');
    const { id } = await this.poolService.use();
    const visibility = this.visibilityList.public;
    const todolistEntity = this.repository.create({ ...param, id, visibility });
    const todolist = await this.repository.save(todolistEntity);
    await this.statusService.init({ todolistId: todolist.id });
    return todolist;
  }

  async update(body: ITodolistUpdate) {
    const { id, name, visibility, isActive, favorite, userId } = body;
    if (!id) throw new BadRequestException();
    const todolist = await this.repository.findOneBy({ id });

    const owner = todolist.userId === userId;
    const write = owner || todolist.visibility === this.visibilityList.public;

    if (defineAny(name, visibility, isActive)) {
      if (!write) throw new ForbiddenException();
      if (isActive !== undefined) {
        if (!owner) throw new ForbiddenException();
        todolist.isActive = isActive;
      }
      if (name) {
        if (!name.trim()) throw new BadRequestException('Empty name');
        todolist.name = name;
      }
      if (visibility) {
        todolist.visibility = visibility;
      }
      await this.repository.save(todolist);
    }

    if (favorite != undefined) {
      this.favoriteService.set({ todolistId: id, userId, isActive: favorite });
    }

    return todolist;
  }
}
