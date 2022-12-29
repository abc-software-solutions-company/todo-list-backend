import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocketGateway } from 'src/websocket/socket.gateway';
import { Repository } from 'typeorm';
import { Notification } from './index.entity';
import { INotificationCreate, INotificationUpdate } from './index.type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) readonly repository: Repository<Notification>,
    readonly socket: SocketGateway,
  ) {}

  getOne(userId: string) {
    if (!userId) throw new BadRequestException();
    const notifications = this.repository.find({
      where: { recipientID: userId },
      order: { createdDate: 'DESC' },
      relations: { sender: true },
    });
    return notifications;
  }

  async create(param: INotificationCreate) {
    const { content, recipientID } = param;
    if (!content) throw new BadRequestException();

    const newNotification = this.repository.create({ ...param });
    const res = await this.repository.save(newNotification);

    if (res) this.socket.updateNotification(recipientID);

    return res;
  }

  async update(param: INotificationUpdate) {
    const { id } = param;
    const notification = await this.repository.findOneBy({ id });

    notification.isRead = true;
    const res = await this.repository.save(notification);

    const { recipientID } = notification;
    if (res) this.socket.updateNotification(recipientID);

    return res;
  }
}
