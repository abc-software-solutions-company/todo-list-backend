import { BadRequestException, Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { PoolService } from 'src/database/pool/pool.service';
import { ICreate, IGetMyList, IGetOne, IUpdate } from './todolist.type';
import { StatusService } from '../status/status.service';
@Injectable()
export class TodolistService {
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };
  constructor(
    @InjectRepository(Todolist) readonly repo: Repository<Todolist>,
    readonly poolService: PoolService,
    readonly statusService: StatusService,
  ) {}

  async sync() {
    const all = await this.repo.find();
    for (let i = 0; i < all.length; i++) {
      console.log('🚀 ~ file: todolist.service.ts ~ line 20 ~ TodolistService ~ sync ~ i', i);
      const list = all[i];
      list.visibility = this.visibilityList.public;
      await this.repo.save(list);
    }
  }

  get() {
    return this.repo.findBy({ isActive: true });
  }
  async getByUser({ userId }: IGetMyList) {
    const result = await this.repo.find({
      where: { isActive: true, userId },
      relations: { favorites: true },
      select: { id: true, name: true, isActive: true, userId: true, visibility: true, createdDate: true },
      order: { createdDate: 'ASC' },
    });
    if (!result) return new BadRequestException();
    return result;
  }

  getFavorite({ userId }: IGetMyList) {
    return this.repo.find({
      where: { isActive: true, favorites: { userId, isActive: true } },
      relations: { favorites: true },
      select: { favorites: { userId: true, todolistId: true, isActive: true, updatedDate: true } },
      order: { favorites: { updatedDate: 'ASC' } },
    });
  }

  async getOne({ id }: IGetOne) {
    if (!id) return new MethodNotAllowedException();
    const result = await this.repo.findOne({
      where: { id, isActive: true },
      relations: { tasks: true, status: true, favorites: true },
      order: { tasks: { index: 'ASC' } },
    });
    if (!result) return new BadRequestException();
    return result;
  }

  async create(body: ICreate) {
    if (!body) return new MethodNotAllowedException();
    const { id } = await this.poolService.getOne();
    const { name, userId } = body;
    if (name.trim().length == 0) return new BadRequestException();
    const visibility = this.visibilityList.public;
    const listEntity = this.repo.create({ name, userId, id, visibility });
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
    list.isActive = isActive === undefined ? list.isActive : isActive;
    list.name = name === undefined ? list.name : name;
    list.visibility = visibility === undefined ? list.visibility : visibility;
    // As a read-only list or private list. Only list owner can update this list.
    if (list.userId !== userId)
      return new BadRequestException('As a read-only list or private list. Only list owner can update this list.');
    if (Object.values(this.visibilityList).includes(visibility)) list.visibility = visibility;
    return this.repo.save(list);
  }
}
