import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';
import { FavoriteService } from './index.service';

describe('TodolistService', () => {
  let poolService: PoolService;
  let moduleRef: TestingModule;
  let todolistService: TodolistService;
  let userService: UserService;
  let favoriteService: FavoriteService;

  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    favoriteService = moduleRef.get<FavoriteService>(FavoriteService);
    await poolService.generate(30);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Favorite Service', () => {
    it('Should create new list and favorite your list', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const response = await favoriteService.set({ userId, isActive: true, todolistId });
      expect(response.todolistId).toEqual(todolistId);
      expect(response.userId).toEqual(userId);
      expect(response.isActive).toEqual(true);
    });
    
    it('Should create new list and favorite list which created by other user', async () => {
      const { id: userId1 } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: userId2 } = await userService.create({ email: undefined, name: 'Thiện' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId: userId2 });

      const response = await favoriteService.set({ userId: userId1, isActive: true, todolistId });
      expect(response.todolistId).toEqual(todolistId);
      expect(response.userId).toEqual(userId1);
      expect(response.isActive).toEqual(true);
    });
  });
});
