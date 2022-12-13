import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TaskUserService } from './index.service';
import { TaskService } from '../task/index.service';
import { StatusService } from '../status/index.service';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';

describe('TaskUserService', () => {
  let taskUserService: TaskUserService;
  let poolService: PoolService;
  let taskService: TaskService;
  let statusService: StatusService;
  let moduleRef: TestingModule;
  let todolistService: TodolistService;
  let userService: UserService;

  beforeEach(async () => {
    moduleRef = await testHelper();
    statusService = moduleRef.get<StatusService>(StatusService);
    taskUserService = moduleRef.get<TaskUserService>(TaskUserService);
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    taskService = moduleRef.get<TaskService>(TaskService);
    userService = moduleRef.get<UserService>(UserService);
    poolService = moduleRef.get<PoolService>(PoolService);
    await poolService.generate(30);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Task User Service', () => {
    it('User Should create task and assign this task to this user (Assign to me)', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const task = await taskService.create({ name: 'Task of Linh', todolistId, userId });
      // Assign chính user hiện tại vào chính task do họ tạo ra trong cùng 1 list cũng chính họ tạo
      await taskUserService.set({ taskId: task.id, ids: [userId] });

      const response = await taskUserService.repository.findOne({ where: { userId, taskId: task.id } });
      expect(response.userId).toEqual(userId);
      expect(response.isActive).toEqual(true);
      expect(response.taskId).toEqual(task.id);
    });

    it('User Should create task and assign this task to other user (Assign to other member)', async () => {
      const { id: userId1 } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: userId2 } = await userService.create({ email: undefined, name: 'Tuyen' });

      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId: userId1 });
      const task = await taskService.create({ name: 'Task of Linh', todolistId, userId: userId1 });
      await taskUserService.set({ taskId: task.id, ids: [userId2] });

      const response = await taskUserService.repository.findOne({ where: { userId: userId2, taskId: task.id } });
      expect(response.userId).toEqual(userId2);
      expect(response.isActive).toEqual(true);
      expect(response.taskId).toEqual(task.id);
    });

    it('User Should create task and assign this task to this user (Assign to me) and then unassigned', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const task = await taskService.create({ name: 'Task of Linh', todolistId, userId });
      // Giai đoạn 1 là tự assign cho chính mình
      await taskUserService.set({ taskId: task.id, ids: [userId] });
      const responseFirst = await taskUserService.repository.findOne({ where: { userId, taskId: task.id } });
      expect(responseFirst.userId).toEqual(userId);
      expect(responseFirst.isActive).toEqual(true);
      expect(responseFirst.taskId).toEqual(task.id);

      // Giai đoạn 2 là tự unassigned
      const response = await taskService.update({
        id: task.id,
        userId,
        isActive: true,
        statusId: 0,
        assignee: undefined,
      });
      expect(response.assignees).toEqual(undefined);
    });
  });
});
