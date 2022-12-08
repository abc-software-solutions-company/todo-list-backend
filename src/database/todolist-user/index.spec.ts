import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { UserService } from '../user/index.service';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { TodolistUserService } from './index.service';

describe('TodolistService', () => {
  let todolistService: TodolistService;
  let userService: UserService;
  let poolService: PoolService;
  let todolistUserService: TodolistUserService;

  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    todolistUserService = moduleRef.get<TodolistUserService>(TodolistUserService);

    await poolService.generate(30);
  });
  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Todolist Use Service (Add member to list)', () => {
    it('Create list and add one user to this list', async () => {
      const name = 'Linh bé nhỏ';
      const { id: userId } = await userService.create({
        email: 'lamminhthien02012000@gmail.com',
        name,
      });
      const { id: todolistId } = await todolistService.create({ name: 'List của Thiện', userId: userId });
      await todolistUserService.set({ todolistId, ids: [userId] });
      const response = await todolistUserService.repository.findOne({ where: { userId, isActive: true, todolistId } });
      expect(response.todolistId).toEqual(todolistId);
      expect(response.userId).toEqual(userId);
      expect(response.isActive).toEqual(true);
    });

    it('Create list and add a lot of user to this list', async () => {
      const name = 'Linh bé nhỏ';
      const { id: userId } = await userService.create({
        email: 'lamminhthien02012000@gmail.com',
        name,
      });
      const { id: userId2 } = await userService.create({
        email: 'johnathan19082022@gmail.com',
        name: 'Johnathan',
      });
      const { id: userId3 } = await userService.create({
        email: 'mrgoodtea_vietnam@gmail.com',
        name: 'MrGoodTea',
      });
      const { id: todolistId } = await todolistService.create({ name: 'List của Thiện', userId: userId });
      await todolistUserService.set({ todolistId, ids: [userId, userId2, userId3] });
      const response = await todolistUserService.repository.find({ where: { isActive: true, todolistId } });
      expect(response.length).toEqual(3);
    });

    it('Create list and add a lot of user to this list and then remove one user', async () => {
      const name = 'Linh bé nhỏ';
      const { id: userId } = await userService.create({
        email: 'lamminhthien02012000@gmail.com',
        name,
      });
      const { id: userId2 } = await userService.create({
        email: 'johnathan19082022@gmail.com',
        name: 'Johnathan',
      });
      const { id: userId3 } = await userService.create({
        email: 'mrgoodtea_vietnam@gmail.com',
        name: 'MrGoodTea',
      });
      const { id: todolistId } = await todolistService.create({ name: 'List của Thiện', userId: userId });
      await todolistUserService.set({ todolistId, ids: [userId, userId2, userId3] });
      const before = await todolistUserService.repository.find({ where: { isActive: true, todolistId } });
      expect(before.length).toEqual(3);

      // Sau đó xóa bớt 1 người ra khỏi list
      await todolistUserService.set({ todolistId, ids: [userId, userId2] });
      const after = await todolistUserService.repository.find({ where: { isActive: true, todolistId } });
      expect(after.length).toEqual(2);
    });
  });
});
