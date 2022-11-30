import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './index.entity';
import { PoolService } from 'src/database/pool/index.service';
import {
  ITodolistSync,
  ITodolistCreate,
  ITodolistGetByUser,
  ITodolistGetFavorite,
  ITodolistGetOne,
  ITodolistUpdate,
  ITodolistSeoOne,
} from './index.type';
import { StatusService } from '../status/index.service';
import { FavoriteService } from '../favorite/index.service';
import { defineAll, defineAny } from 'src/utils/function';
import { TodolistUserService } from '../todolist-user/index.service';
import { AuthService } from 'src/auth/index.service';
import { TaskService } from '../task/index.service';
import { TaskUserService } from '../task-user/index.service';

@Injectable()
export class TodolistService {
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };

  constructor(
    @InjectRepository(Todolist) readonly repository: Repository<Todolist>,
    @Inject(forwardRef(() => TaskService)) readonly task: TaskService,
    readonly pool: PoolService,
    readonly status: StatusService,
    readonly favorite: FavoriteService,
    readonly member: TodolistUserService,
    readonly assignee: TaskUserService,
    readonly auth: AuthService,
  ) {}

  get() {
    return this.repository.findBy({ isActive: true });
  }

  async seoOne({ id }: ITodolistSeoOne) {
    if (!defineAll(id)) throw new BadRequestException('Todolist getOne Err param');

    const todolistRecord = this.repository.findOne({
      select: ['id', 'name', 'visibility'],
      where: { id, isActive: true },
    });

    const taskRecords = this.task.repository.find({
      select: ['id', 'name', 'index'],
      where: { todolistId: id, isActive: true },
      order: { index: 'DESC' },
      take: 3,
    });

    const promises = await Promise.all([todolistRecord, taskRecords]);

    const todolist = promises[0];
    const tasks = promises[1];

    const isPrivate = todolist.visibility === this.visibilityList.private;
    const title = isPrivate ? 'Task Not Found' : todolist.name;
    const description = isPrivate ? undefined : tasks.reduce((pre, cur) => (cur.name ? pre + cur.name : pre), '');

    return { title, description };
  }

  async getByUser({ userId }: ITodolistGetByUser) {
    if (!defineAll(userId)) throw new BadRequestException('Todolist getByUser Err Param');

    const todolistRecords = await this.repository.find({
      select: ['id', 'name', 'userId', 'visibility'],
      where: { isActive: true, userId },
      relations: { favorites: true, members: { user: true } },
      order: { createdDate: 'ASC' },
    });

    const response = todolistRecords.map(({ favorites, members, ...rest }) => {
      const favorite = Boolean(favorites.filter((e) => e.userId == userId).length);
      return {
        ...rest,
        favorite,
        members: members.map(({ user }) => ({ id: user.id, name: user.name, email: user.id })),
      };
    });

    return response;
  }

  async getFavorite({ userId }: ITodolistGetFavorite) {
    if (!defineAll(userId)) throw new BadRequestException('Todolist getFavorite Err Param');

    const todolistRecords = await this.repository.find({
      select: ['id', 'name', 'userId', 'visibility'],
      where: { isActive: true, favorites: { userId, isActive: true } },
      relations: { favorites: true },
      order: { favorites: { updatedDate: 'ASC' } },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = todolistRecords.map(({ favorites, ...rest }) => ({ ...rest, favorite: true }));

    return response;
  }

  async getMyTask({ userId }: ITodolistGetByUser) {
    // const lists = await this.repository.find({
    //   select: ['todolistId'],
    //   where: { userId, isActive: true },
    //   relations: { todolist: true },
    // });

    // return lists.map(({ todolistId, todolist: { name } }) => ({ todolistId, name }));

    return userId;
  }

  async getOne({ id, userId }: ITodolistGetOne) {
    if (!defineAll(id, userId)) throw new BadRequestException('Todolist getOne Err param');

    const todolistRecord = this.repository.findOne({
      select: ['id', 'name', 'userId', 'visibility'],
      where: { id, isActive: true },
    });

    const taskRecords = this.task.repository.find({
      select: ['id', 'name', 'isDone', 'statusId', 'index', 'priority'],
      where: { todolistId: id, isActive: true },
      relations: { assignees: { user: true } },
      order: { index: 'DESC' },
    });

    const favoriteRecord = this.favorite.repository.findOne({ where: { userId, todolistId: id, isActive: true } });

    const statusRecords = this.status.repository.find({
      select: ['id', 'name', 'color', 'index'],
      where: { todolistId: id, isActive: true },
    });

    const memberRecords = this.member.repository.find({
      select: ['todolistId', 'isActive'],
      where: { todolistId: id, isActive: true },
      relations: { user: true },
    });

    const promises = await Promise.all([todolistRecord, taskRecords, favoriteRecord, statusRecords, memberRecords]);

    const todolist = promises[0];
    const tasks = promises[1];
    const favorite = Boolean(promises[2]);
    const status = promises[3];
    const members = promises[4].map(({ user }) => ({ id: user.id, name: user.name, email: user.email }));

    tasks.forEach((e) => {
      e.assignees = e.assignees.filter((e) => e.isActive);
    });

    return { ...todolist, tasks, favorite, status, members };
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

  async update(param: ITodolistUpdate) {
    const { id, userId, name, visibility, isActive, favorite, member } = param;
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
      if (favorite !== undefined) {
        await this.favorite.set({ todolistId: id, userId, isActive: favorite });
      }

      if (member) {
        await this.member.set({ todolistId: id, ids: member.ids });
      }
    }

    return todolist;
  }

  async sync(body: ITodolistSync) {
    const { email, name, userId } = body;
    const userHaveEmail = await this.auth.login({ email, name });
    const guestList = await this.repository.findBy({ userId });

    if (guestList.length) {
      const promise = [];
      guestList.map((e) => {
        e.userId = userHaveEmail.user.id;
        promise.push(this.repository.save(e));
      });
      await Promise.allSettled(promise);
    }
    return userHaveEmail;
  }
}
