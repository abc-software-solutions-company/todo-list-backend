import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { Any } from 'typeorm';
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

  const userId = '5e1699ca-a085-4bff-8f6d-078d829e7eed';

  describe('Todolist Service Create', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const name = 'Linh';
      const response = await todolistService.create({ name, userId });
      expect(response.name).toEqual(name);
      expect(response.userId).toEqual(userId);
    });

    it('Should return error when list name not type', async () => {
      const name = undefined;
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toEqual(405);
    });

    it('Should return  errorr when list name when type space character only', async () => {
      const name = '     ';
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toEqual(405);
    });
  });

  // describe('Todolist Service Update', () => {
  //   it('Should return list and verify that list is own by this userId', async () => {
  //     const name = 'Linh Phạm';
  //     const id = '5e1699ca-a085-4bff-8f6d-078d829e7eed';
  //     const favorite = true;
  //     const isActive = true;
  //     const member = {};
  //     const visibility = null;

  //     const response = await todolistService.update({id, favorite, name, isActive, member, visibility });
  //     expect(response.status).toEqual(200);
  //   });

  //   it('Should return error when list name not type', async () => {
  //     const name = undefined;
  //     let response;
  //     try {
  //       response = await todolistService.create({ name, userId });
  //     } catch (err) {
  //       response = err.response;
  //     }
  //     expect(response.statusCode).toEqual(405);
  //   });

  //   it('Should return  errorr when list name when type space character only', async () => {
  //     const name = '     ';
  //     let response;
  //     try {
  //       response = await todolistService.create({ name, userId });
  //     } catch (err) {
  //       response = err.response;
  //     }
  //     expect(response.statusCode).toEqual(405);
  //   });
  // });
});
