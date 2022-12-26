import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './index.entity';
import { INotificationCreate } from './index.type';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) readonly repository: Repository<Notification>) {}

  getOne(userId: string) {
    if (!userId) throw new BadRequestException();
    const notifications = this.repository.find({
      where: { recipientID: userId },
      order: { createdDate: 'DESC' },
      relations: { sender: true },
    });
    return notifications;
  }

  create(param: INotificationCreate) {
    const { content } = param;
    if (!content) throw new BadRequestException();
    const newNotification = this.repository.create({ ...param });
    return this.repository.save(newNotification);
  }
}
