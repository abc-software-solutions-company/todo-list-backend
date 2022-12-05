
import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { AttachmentService } from './index.service';

describe('TodolistService', () => {
  let attachmentService: AttachmentService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    attachmentService = moduleRef.get<AttachmentService>(AttachmentService);
  });
  
  afterEach(async () => {
    await moduleRef.close();
  });

  const userId = 'ae1e1ec3-ed48-4e9d-83db-9be98aea1ea0';
  const taskId = 'f221033d-5af5-4ec4-a82d-49f09c6caa4e';

  describe('Attachment Service', () => {
    it('Should return write comment in attachment', async () => {
      const name = 'Hinh 1';
      const link = 'https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg?cs=srgb&dl=pexels-nextvoyage-1518500.jpg&fm=jpg';
      const response = await attachmentService.create({name, taskId, userId, link });
      expect(response.name).toEqual(name);
      expect(response.link).toEqual(link);
    });
  });
});

