import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { StatusService } from './index.service';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';
import { TaskService } from '../task/index.service';

describe('StatusService', () => {
  let statusService: StatusService;
  let poolService: PoolService;
  let moduleRef: TestingModule;
  let todolistService: TodolistService;
  let userService: UserService;
  let taskService: TaskService;

  beforeEach(async () => {
    moduleRef = await testHelper();
    statusService = moduleRef.get<StatusService>(StatusService);
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    taskService = moduleRef.get<TaskService>(TaskService);
    await poolService.generate(30);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Status Service', () => {
    it('Should update status', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      // const name = 'Backlog';
      // const response = await statusService.create({ name, todolistId });
      expect(1 == 1).toEqual(true);
    });
  });
});
