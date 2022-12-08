import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TaskUserService } from './index.service';
import { TaskService} from '../task/index.service';
import { StatusService } from '../status/index.service';
import { PoolService } from '../pool/index.service';
import { TodolistService } from '../todolist/index.service';
import { UserService } from '../user/index.service';

describe('TaskUserService', () =>{
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
    it('Should task', async () => {
      const { id: userId } = await userService.create({ email: undefined, name: 'Linh' });
      const { id: todolistId } = await todolistService.create({ name: 'List of Linh', userId});
      const {id: taskId} = await taskService.create({name: "Task of Linh",todolistId ,userId})
      // const response = await taskUserService.set({taskId, ids});
      // expect(response.isActive).toEqual(true);
    });
  });
});
