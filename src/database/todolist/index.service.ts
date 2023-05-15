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
  ISeedListTask,
  ISeedListDoc,
} from './index.type';
import { StatusService } from '../status/index.service';
import { FavoriteService } from '../favorite/index.service';
import { defineAll, defineAny, getRandomItemInArray, getRandomPropertyFromObject } from 'src/utils/function';
import { TodolistUserService } from '../todolist-user/index.service';
import { AuthService } from 'src/auth/index.service';
import { TaskService } from '../task/index.service';
import { TaskUserService } from '../task-user/index.service';
import Jabber from 'jabber';
import { DocumentService } from '../document/index.service';
import { priorities } from 'src/utils/constants';

@Injectable()
export class TodolistService {
  readonly indexStep: number = Math.pow(2, 30);
  readonly visibilityList = { public: 'PUBLIC', readonly: 'READ_ONLY', private: 'PRIVATE' };

  constructor(
    @InjectRepository(Todolist) readonly repository: Repository<Todolist>,
    @Inject(forwardRef(() => TaskService)) readonly task: TaskService,
    @Inject(forwardRef(() => DocumentService)) readonly document: DocumentService,
    readonly pool: PoolService,
    readonly status: StatusService,
    readonly favorite: FavoriteService,
    readonly member: TodolistUserService,
    readonly assignee: TaskUserService,
    readonly auth: AuthService,
  ) {}

  get() {
    return this.repository.find({ where: { isActive: true }, order: { createdDate: 'DESC' }, take: 100 });
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
      const favorite = Boolean(favorites.filter((e) => e.userId == userId && e.isActive).length);
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

    const checkVisibility = (list: Todolist) => {
      if (list.visibility == this.visibilityList.private) {
        if (userId == list.userId) return true;
      }
      if (list.visibility == this.visibilityList.public || list.visibility == this.visibilityList.readonly) return true;
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = todolistRecords
      .filter((e) => checkVisibility(e))
      .map(({ favorites, ...rest }) => ({ ...rest, favorite: true }));

    return response;
  }

  async getMyTasks({ userId }: ITodolistGetByUser) {
    const todolists = await this.repository.find({
      select: ['id', 'name', 'userId', 'visibility', 'taskSymbol'],
      where: { isActive: true, tasks: { isActive: true, assignees: { isActive: true, userId } } },
      relations: { members: { user: true }, tasks: { assignees: true }, status: true },
      order: { tasks: { index: 'DESC' } },
    });
    const pattern = ({ id, members, name, status, tasks, userId, visibility, taskSymbol }) => {
      return {
        id,
        name,
        visibility,
        userId,
        taskSymbol,
        tasks: tasks.map(({ id, name, assignees, priority, isDone, statusId, order, isFeature }) => ({
          id,
          name,
          assignees,
          priority,
          isDone,
          statusId,
          isFeature,
          order,
        })),
        status,
        members: members.map(({ user }) => ({ id: user.id, name: user.name, email: user.id })),
      };
    };

    const response = todolists.map((data) => {
      if (data.visibility === this.visibilityList.private) {
        if (data.userId === userId) return pattern(data);
      } else {
        return pattern(data);
      }
    });

    return response;
  }

  async getOne({ id, userId }: ITodolistGetOne) {
    console.log('🚀 ~ file: index.service.ts:171 ~ TodolistService ~ getOne ~ { id, userId }:', { id, userId });
    if (!defineAll(id, userId)) throw new BadRequestException('Todolist getOne Err param');

    const todolistRecord = this.repository.findOne({
      select: ['id', 'name', 'userId', 'visibility', 'taskSymbol'],
      where: { id, isActive: true },
    });

    const taskRecords = this.task.repository.find({
      select: ['id', 'name', 'isDone', 'statusId', 'index', 'priority', 'createdDate', 'order', 'isFeature'],
      where: { todolistId: id, isActive: true },
      relations: { assignees: { user: true } },
      order: { index: 'DESC' },
    });

    const favoriteRecord = this.favorite.repository.findOne({ where: { userId, todolistId: id, isActive: true } });

    const statusRecords = this.status.repository.find({
      select: ['id', 'name', 'color', 'index'],
      where: { todolistId: id, isActive: true },
      order: { index: 'ASC' },
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
    status.forEach((e, idx) => {
      e.tasks = tasks.filter((e) => e.statusId == status[idx].id);
    });

    if (todolist.visibility === this.visibilityList.private && userId !== todolist.userId)
      throw new MethodNotAllowedException('Private list, you are not owner to view this');

    return { ...todolist, favorite, status, members, tasks };
  }

  async getOneKanban({ id, userId }: ITodolistGetOne) {
    if (!defineAll(id, userId)) throw new BadRequestException('Todolist getOne Err param');

    const todolistRecord = this.repository.findOne({
      select: ['id', 'name', 'userId', 'visibility', 'taskSymbol'],
      where: { id, isActive: true },
    });

    const taskRecords = this.task.repository.find({
      select: [
        'id',
        'name',
        'isDone',
        'statusId',
        'index',
        'priority',
        'dueDate',
        'storyPoint',
        'indexColumn',
        'order',
        'isFeature',
      ],
      where: { todolistId: id, isActive: true },
      relations: { assignees: { user: true }, attachments: true },
      order: { indexColumn: 'ASC' },
    });

    const favoriteRecord = this.favorite.repository.findOne({ where: { userId, todolistId: id, isActive: true } });

    const statusRecords = this.status.repository.find({
      select: ['id', 'name', 'color', 'index'],
      where: { todolistId: id, isActive: true },
      order: { index: 'ASC' },
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
    status.forEach((e, idx) => {
      e.tasks = tasks.filter((e) => e.statusId == status[idx].id);
    });

    if (todolist.visibility === this.visibilityList.private && userId !== todolist.userId)
      throw new MethodNotAllowedException('Private list, you are not owner to view this');

    return { ...todolist, favorite, status, members, tasks };
  }

  async create(param: ITodolistCreate) {
    const { name, userId, email } = param;
    if (!name || (name && !name.trim())) throw new MethodNotAllowedException('Empty name');
    const { id } = await this.pool.use();
    const visibility = this.visibilityList.public;
    const todolistEntity = this.repository.create({ ...param, id, visibility });
    const todolist = await this.repository.save(todolistEntity);
    await this.status.init({ todolistId: id });
    if (email) await this.member.set({ todolistId: id, ids: [userId] }, { nameOfTodolist: name, ownerId: userId });
    return todolist;
  }

  async update(param: ITodolistUpdate) {
    const {
      id,
      userId,
      name,
      visibility,
      isActive,
      favorite,
      member,
      statusId,
      statusIndex,
      resetIndexStatus,
      taskSymbol,
    } = param;
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

      todolist.taskSymbol = taskSymbol;

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
        await this.member.set({ todolistId: id, ids: member.ids }, { nameOfTodolist: name, ownerId: userId });
      }
    }

    if (defineAll(statusId, statusIndex)) {
      await this.status.update({ id: statusId, todolistId: id, index: statusIndex });
      if (resetIndexStatus) this.status.resetIndex({ todolistId: id });
    }

    return todolist;
  }

  async sync(body: ITodolistSync) {
    const { email, name, userId } = body;
    const ownerId = userId;
    const userHaveEmail = await this.auth.login({ email, name });
    const guestList = await this.repository.findBy({ userId });

    if (guestList.length) {
      const promise = [];
      guestList.map(async (e) => {
        e.userId = userHaveEmail.user.id;
        const memberIds = e.members?.map((e) => e.userId) || [];
        const { userId } = await this.repository.save(e);
        memberIds.push(userId);
        promise.push(this.member.set({ todolistId: e.id, ids: memberIds }, { nameOfTodolist: name, ownerId: ownerId }));
      });
      await Promise.allSettled(promise);
    }
    return userHaveEmail;
  }

  async assignIndexColumn() {
    const todolists = await this.repository.find();
    todolists.forEach(async (list) => {
      const taskList = await this.task.repository.find({ where: { todolistId: list.id } });
      const taskListLength = taskList.length;
      for (let i = 0; i < taskListLength; i++) {
        if (taskList[i].indexColumn == undefined) {
          taskList[i].indexColumn = (i + 1) * this.indexStep;
          await this.task.repository.save(taskList[i]);
          console.log(`Task ${taskList[i].name} is done`);
        }
      }
    });
    return 'OK';
  }

  async seedListTask(body: ISeedListTask) {
    const { id, quantity, wordCount, userId } = body;
    if (!defineAll(id, quantity, wordCount, userId)) throw new BadRequestException('Params not enough');
    if (isNaN(quantity) || isNaN(wordCount)) throw new BadRequestException('Quantity or Word count must be number');
    const list = await this.repository.findOne({ where: { id }, relations: { status: true } });
    if (!list) throw new BadRequestException('List not found');
    const { id: todolistId, status } = list;
    const jabber = new Jabber();
    for (let i = 0; i < quantity; i++) {
      const name = jabber.createWord(wordCount);
      await this.task.create({
        name,
        userId,
        statusId: getRandomItemInArray(status).id,
        priority: getRandomPropertyFromObject(priorities) as string,
        todolistId,
      });
    }
  }

  async seedListDoc(body: ISeedListDoc) {
    const { docContentLength, docNameLength, id, quantityParentDoc } = body;

    if (!defineAll(docContentLength, docNameLength, id, quantityParentDoc))
      throw new BadRequestException('Params not enough');
    if (isNaN(docContentLength) || isNaN(docNameLength) || isNaN(quantityParentDoc))
      throw new BadRequestException('Some param must be number');

    const list = await this.repository.findOne({ where: { id }, relations: { status: true } });
    if (!list) throw new BadRequestException('List not found');

    const { id: todolistId } = list;
    const jabber = new Jabber();

    const promises = [];
    for (let i = 0; i < quantityParentDoc; i++) {
      const parentDocName = jabber.createWord(docNameLength);
      const docContent = jabber.createParagraph(docContentLength);
      promises.push(this.document.create({ name: parentDocName, todolistId, content: docContent }));
    }

    await Promise.allSettled(promises);
  }
}
