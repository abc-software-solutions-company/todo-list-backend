import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './index.entity';
import { PoolService } from 'src/database/pool/index.service';
import {
  ITodolistCreate,
  ITodolistGetByUser,
  ITodolistGetFavorite,
  ITodolistGetOne,
  ITodolistUpdate,
} from './index.type';
import { StatusService } from '../status/index.service';
import { FavoriteService } from '../favorite/index.service';
import { defineAll, defineAny } from 'src/utils/function';
import { TodolistUserService } from '../todolist-user/index.service';
@Injectable()
export class TodolistService {
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };

  constructor(
    @InjectRepository(Todolist) readonly repository: Repository<Todolist>,
    readonly pool: PoolService,
    readonly status: StatusService,
    readonly favorite: FavoriteService,
    readonly member: TodolistUserService,
  ) {}

  get() {
    return this.repository.findBy({ isActive: true });
  }

  getByUser({ userId }: ITodolistGetByUser) {
    if (!defineAll(userId)) throw new BadRequestException('Todolist getByUser Err Param');
    return this.repository.find({
      where: { isActive: true, userId },
      relations: { favorites: true },
      order: { createdDate: 'ASC' },
    });
  }

  getFavorite({ userId }: ITodolistGetFavorite) {
    if (!defineAll(userId)) throw new BadRequestException('Todolist getFavorite Err Param');
    return this.repository.find({
      where: { isActive: true, favorites: { userId, isActive: true } },
      relations: { favorites: true },
      order: { favorites: { updatedDate: 'ASC' } },
    });
  }

  getOne({ id }: ITodolistGetOne) {
    if (!defineAll(id)) throw new BadRequestException('Todolist getOne Err param');
    return this.repository.findOne({
      where: { id, isActive: true },
      relations: { tasks: { assignees: { user: true } }, status: true, favorites: true, members: { user: true } },
      order: { tasks: { index: 'ASC' }, status: { index: 'ASC' } },
    });
  }

  async create(param: ITodolistCreate) {
    const { name } = param;
    if (!name || (name && !name.trim())) throw new MethodNotAllowedException('Empty name');
    const { id } = await this.pool.use();
    const visibility = this.visibilityList.public;
    const todolistEntity = this.repository.create({ ...param, id, visibility });
    const todolist = await this.repository.save(todolistEntity);
    await this.status.init({ todolistId: id });
    return todolist;
  }

  async update(body: ITodolistUpdate) {
    const { id, userId, name, visibility, isActive, favorite, member } = body;
    if (!defineAll(id, userId)) throw new BadRequestException();

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

    if (defineAny(favorite, member)) {
      if (favorite) {
        await this.favorite.set({ todolistId: id, userId, isActive: favorite });
      }

      if (member && member.emails.length) {
        await this.member.set({ todolistId: id, emails: member.emails });
      }
    }

    return todolist;
  }
}
