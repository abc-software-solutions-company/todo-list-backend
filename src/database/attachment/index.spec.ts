
import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { AttachmentService } from './index.service';
import {TaskService} from '../task/index.service';
import {UserService} from '../user/index.service'
import {TodolistService} from '../todolist/index.service';
import {PoolService} from '../pool/index.service';

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
    poolService =moduleRef.get<PoolService>(PoolService);
    await poolService.generate(100);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Attachment Service', () => {
    it('Should return write comment in attachment', async () => {
      const {id:userId} = await userService.create({email: undefined,name: "Linh"});
      const {id:todolistId} = await todolistService.create({name: "List of Linh",userId})
      const {id:taskId} = await taskService.create({name: "hes lloooooooo",todolistId ,userId ,description:"mo ta chi tiet noi dung task"})
      const name = 'Hinh 1';
      const link = 'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const response = await attachmentService.create({name, taskId, userId, link });
      expect(response.name).toEqual(name);
      expect(response.link).toEqual(link);
    });

    it('Should return write comment in attachment update', async () => {
      const {id:userId} = await userService.create({email: undefined,name: "Linh"});
      const {id:todolistId} = await todolistService.create({name: "List of Linh",userId})
      const {id:taskId} = await taskService.create({name: "hes lloooooooo",todolistId ,userId ,description:"mo ta chi tiet noi dung task"})
      const name = 'Hinh 1';
      const link = 'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const {id,...res}  = await attachmentService.create({name, taskId, userId, link });
      const newName = "Hinh 1 update";
      const response = await attachmentService.update({id,name:newName,...res})
      expect(response.name).toEqual(name);
      expect(response.link).toEqual(link);
    });

    it('Should return write comment in attachment detele', async () => {
      const {id:userId} = await userService.create({email: undefined,name: "Linh"});
      const {id:todolistId} = await todolistService.create({name: "List of Linh",userId})
      const {id:taskId} = await taskService.create({name: "hes lloooooooo",todolistId ,userId ,description:"mo ta chi tiet noi dung task"})
      const name = 'Hinh 1';
      const link = 'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const attachment  = await attachmentService.create({name, taskId, userId, link });
      const isActiveNew = false;
      const response = await attachmentService.update({id:attachment.id,taskId:attachment.taskId,userId,isActive:isActiveNew,link,name})
      console.log(response);
      expect(response.isActive).toEqual(isActiveNew);
    });
  });
});

