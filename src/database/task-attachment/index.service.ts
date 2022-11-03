import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskAttachment } from './index.entity';
import { ITaskAttachmentCreate, ITaskAttachmentUpdate } from './index.type';

@Injectable()
export class TaskAttachmentService {
  constructor(@InjectRepository(TaskAttachment) readonly repository: Repository<TaskAttachment>) {}

  get() {
    return this.repository.find();
  }

  create(param: ITaskAttachmentCreate) {
    const taskAttachment = this.repository.create({ ...param, isActive: true });
    return this.repository.save(taskAttachment);
  }

  async update(param: ITaskAttachmentUpdate) {
    const { taskId, attachmentId, isActive } = param;
    const taskAttachment = await this.repository.findOneBy({ taskId, attachmentId });
    taskAttachment.isActive = isActive;
    return this.repository.save(taskAttachment);
  }
}
