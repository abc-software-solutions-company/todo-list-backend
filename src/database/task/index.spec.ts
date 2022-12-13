import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TaskService } from './index.service';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';

describe('TaskService', () => {
  let taskService: TaskService;
  let poolService: PoolService;
  let moduleRef: TestingModule;
  let todolistService: TodolistService;
  let userService: UserService;

  beforeEach(async () => {
    moduleRef = await testHelper();
    taskService = moduleRef.get<TaskService>(TaskService);
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    await poolService.generate(30);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Status Service', () => {
    it('Should create new task', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const name = 'Task 1: cần làm gì';
      const description = 'mo ta chi tiet noi dung task';
      const response = await taskService.create({ name, todolistId, userId, description });
      expect(response.name).toEqual(name);
    });

    it('Should update task', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const oldTask = 'Task 1: cần làm gì';
      const task = await taskService.create({ name: oldTask, todolistId, userId });
      const updateTask = 'Task 1: cần làm gì update';
      const storyPoint = '16';
      const description = 'This is task Description';
      const response = await taskService.update({
        id: task.id,
        userId,
        name: updateTask,
        isActive: task.isActive,
        statusId: 0,
        assignee: undefined,
        storyPoint,
        description,
      });
      expect(response.name).toEqual(updateTask);
    });

    it('Should detele task', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const name = 'xóa task thành công';
      const task = await taskService.create({ name, todolistId, userId });
      const response = await taskService.update({
        id: task.id,
        userId,
        isActive: false,
        statusId: 0,
        assignee: undefined,
      });
      expect(response.isActive).toEqual(false);
    });
  });
});
