
import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { CommentService } from './index.service';
import { PoolService} from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';
import { TaskService } from '../task/index.service';


describe('TodolistService', () => {
  let commentService: CommentService;
  let poolService: PoolService;
  let moduleRef: TestingModule;
  let todolistService: TodolistService;
  let userService: UserService;
  let taskService: TaskService;


  beforeEach(async () => {
    moduleRef = await testHelper();
    commentService = moduleRef.get<CommentService>(CommentService);
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService =moduleRef.get<PoolService>(PoolService);
    taskService=moduleRef.get<TaskService>(TaskService);
    await poolService.generate(30);
  });
  
  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Attachment Service', () => {
    it('Should return write comment in attachment', async () => {
      const {id:userId} = await userService.create({email: undefined,name: "Linh"});
      const {id:todolistId} = await todolistService.create({name: "List of Linh",userId})
      const {id:taskId} = await taskService.create({name: "hes lloooooooo",todolistId ,userId ,description:"mo ta chi tiet noi dung task"})
      const comment = 'Hinh 11';
      const response = await commentService.create({comment,taskId,userId});
      expect(response.comment).toEqual(comment);
    });
  });
});
