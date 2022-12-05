import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TodolistService } from './index.service';
import {UserService} from '../user/index.service'
import {PoolService} from '../pool/index.service';



describe('TodolistService', () => {
  let todolistService: TodolistService;
  let userService: UserService;
  let poolService: PoolService;


  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
    userService = moduleRef.get<UserService>(UserService);
    poolService =moduleRef.get<PoolService>(PoolService);
  });
  afterEach(async () => {
    await moduleRef.close();
  });


  describe('Todolist Service Create', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const {id:userId} = await userService.create({email:"",name: "Linh"});
      const response = await todolistService.create({ name:'List cua linh', userId });
      expect(response.name).toEqual(name);
      expect(response.userId).toEqual(userId);
    });

    // it('Should return error when list name not type', async () => {
    //   const name = undefined;
    //   let response;
    //   try {
    //     response = await todolistService.create({ name, userId });
    //   } catch (err) {
    //     response = err.response;
    //   }
    //   expect(response.statusCode).toEqual(405);
    // });

    // it('Should return  errorr when list name when type space character only', async () => {
    //   const name = '     ';
    //   let response;
    //   try {
    //     response = await todolistService.create({ name, userId });
    //   } catch (err) {
    //     response = err.response;
    //   }
    //   expect(response.statusCode).toEqual(405);
    // });
  });

  describe('Todolist Service Update', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const {id:userId} = await userService.create({email: undefined,name: "Linh"});
      const {id:todolistId} = await todolistService.create({name: "List of Linh",userId})
      const favorite = true;
      const isActive = true;
      const newName = "List of Linh Update";
      const visibility = "READ_ONLY";
      const ids = [];

      const response = await todolistService.update({id:todolistId, favorite, name:newName, isActive, visibility, member:{ids}, userId});
      expect(response.name).toEqual(newName);
    });

    // it('Should return error when list name not type', async () => {
    //   const name = undefined;
    //   let response;
    //   try {
    //     response = await todolistService.create({ name, userId });
    //   } catch (err) {
    //     response = err.response;
    //   }
    //   expect(response.statusCode).toEqual(405);
    // });

    // it('Should return  errorr when list name when type space character only', async () => {
    //   const name = '     ';
    //   let response;
    //   try {
    //     response = await todolistService.create({ name, userId });
    //   } catch (err) {
    //     response = err.response;
    //   }
    //   expect(response.statusCode).toEqual(405);
    // });
  });
});
