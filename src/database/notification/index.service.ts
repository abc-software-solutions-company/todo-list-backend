import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './index.entity';
import { INotificationCreate, INotificationGet } from './index.type';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) readonly repository: Repository<Notification>) {}

  getOne(param: INotificationGet) {
    const { userId } = param;
    if (!userId) throw new BadRequestException();
    const notifications = this.repository.find({ where: { userId }, order: { createdDate: 'DESC' } });
    return notifications;
  }

  create(param: INotificationCreate) {
    const { content } = param;
    if (!content) throw new BadRequestException();
    const newNotification = this.repository.create({ ...param });
    return this.repository.save(newNotification);
  }
}
