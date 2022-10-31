import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskImage } from './taskImage.entity';
import { ITaskImageCreate, ITaskImageUpdate } from './taskImage.type';

@Injectable()
export class TaskImageService {
  constructor(@InjectRepository(TaskImage) readonly repository: Repository<TaskImage>) {}

  get() {
    return this.repository.find();
  }

  create(param: ITaskImageCreate) {
    const taskImage = this.repository.create({ ...param, isActive: true });
    return this.repository.save(taskImage);
  }

  async update(param: ITaskImageUpdate) {
    const { taskId, imageId, isActive } = param;
    const taskImage = await this.repository.findOneBy({ taskId, imageId });
    taskImage.isActive = isActive;
    return this.repository.save(taskImage);
  }
}
