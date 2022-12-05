import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { TodolistService } from './index.service';

describe('TodolistService', () => {
  let todolistService: TodolistService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
  });
  afterEach(async () => {
    await moduleRef.close();
  });

  const userId = 'fa618c0f-13eb-431c-8b05-9cee6929542a';

  describe('Todolist Service Create', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const name = 'Linh';
      const response = await todolistService.create({ name, userId });
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
      const name = 'Công việc của tôi thứ 3 (ngày 29, tháng 11) update-----';
      const id = 'r24ax';
      const favorite = true;
      const isActive = true;
      const visibility = "READ_ONLY";
      const ids = [];

      const response = await todolistService.update({id, favorite, name, isActive, visibility, member:{ids}, userId});
      expect(response.name).toEqual(name);
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
