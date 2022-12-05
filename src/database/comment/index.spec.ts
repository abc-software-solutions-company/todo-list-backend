
import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { CommentService } from './index.service';

describe('TodolistService', () => {
  let commentService: CommentService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    commentService = moduleRef.get<CommentService>(CommentService);
  });
  
  afterEach(async () => {
    await moduleRef.close();
  });

  const userId = 'ae1e1ec3-ed48-4e9d-83db-9be98aea1ea0';
  const taskId = 'f221033d-5af5-4ec4-a82d-49f09c6caa4e';

  describe('Attachment Service', () => {
    it('Should return write comment in attachment', async () => {
      const comment = 'Hinh 11';
      const response = await commentService.create({comment,taskId,userId});
      expect(response.comment).toEqual(comment);
    });
  });
});
