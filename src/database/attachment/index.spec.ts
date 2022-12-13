import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { AttachmentService } from './index.service';
import { TaskService } from '../task/index.service';
import { UserService } from '../user/index.service';
import { TodolistService } from '../todolist/index.service';
import { PoolService } from '../pool/index.service';

describe('TodolistService', () => {
  let attachmentService: AttachmentService;
  let taskService: TaskService;
  let userService: UserService;
  let todolistService: TodolistService;
  let poolService: PoolService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    attachmentService = moduleRef.get<AttachmentService>(AttachmentService);
    taskService = moduleRef.get<TaskService>(TaskService);
    userService = moduleRef.get<UserService>(UserService);
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    poolService = moduleRef.get<PoolService>(PoolService);
    await poolService.generate(100);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Attachment Service', () => {
    it('Should create new attachment', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      const name = 'Hinh 1';
      const link =
        'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const response = await attachmentService.create({ name, taskId, userId, link });
      expect(response.name).toEqual(name);
      expect(response.link).toEqual(link);
    });

    it('Should create attachment and update attachment name', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      const name = 'Hinh 1';
      const link =
        'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const { id, name: nameDesctruct, ...res } = await attachmentService.create({ name, taskId, userId, link });
      const newName = 'Hinh 1 update';
      const response = await attachmentService.update({ id, name: newName, ...res });
      expect(response.name).toEqual(newName);
      expect(response.link).toEqual(link);
    });

    it('Should create attachment and update attachment link', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      const name = 'Hinh 1';
      const link =
        'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const { id, link: linkDesctruct, ...res } = await attachmentService.create({ name, taskId, userId, link });
      const newLink = 'https://new.images.com/image1.png';
      const response = await attachmentService.update({ id, link: newLink, ...res });
      expect(response.name).toEqual(name);
      expect(response.link).toEqual(newLink);
    });

    it('Should create attachment and update both name and link', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      const nameAttach = 'Hinh 1';
      const linkAttach =
        'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, name, link, ...res } = await attachmentService.create({
        name: nameAttach,
        taskId,
        userId,
        link: linkAttach,
      });
      const newLink = 'https://new.images.com/image1.png';
      const newName = 'Hinh 1 Update';
      const response = await attachmentService.update({ id, link: newLink, name: newName, ...res });
      expect(response.name).toEqual(newName);
      expect(response.link).toEqual(newLink);
    });

    it('Should return write comment in attachment detele', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId });
      const { id: taskId } = await taskService.create({
        name: 'hes lloooooooo',
        todolistId,
        userId,
        description: 'mo ta chi tiet noi dung task',
      });
      const name = 'Hinh 1';
      const link =
        'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const { isActive, id, ...res } = await attachmentService.create({ name, taskId, userId, link });
      const response = await attachmentService.update({ isActive: false, id, ...res });
      // console.log(response);
      expect(response.isActive).toEqual(false);
    });
  });
});
