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
      where: { recipientId: userId },
      order: { createdDate: 'DESC' },
      relations: { sender: true, recipient: true },
    });
    return notifications;
  }

  async createMany(params: INotificationCreate[]) {
    const promises: Promise<Notification>[] = [];
    const recipientIds: string[] = [];

    params.forEach((param) => {
      const { recipientId, senderId } = param;
      if (!recipientId || !senderId) throw new BadRequestException();

      const newNotification = this.repository.create({ ...param });
      const res = this.repository.save(newNotification);
      promises.push(res);
      recipientIds.push(recipientId);
    });

    const result = Promise.all(promises).then(() => {
      this.socket.updateNotification(recipientIds);
    });

    return result;
  }

  async updateOne(param: INotificationUpdate) {
    const recipientIds: string[] = [];

    const { id } = param;
    const notification = await this.repository.findOneBy({ id });

    notification.isRead = true;
    const res = await this.repository.save(notification);

    const { recipientId } = notification;
    recipientIds.push(recipientId);
    if (res) this.socket.updateNotification(recipientIds);

    return res;
  }

  async UpdateAll(userId: string) {
    const recipientIds: string[] = [];
    if (!userId) throw new BadRequestException();
    const notifications = this.repository.find({
      where: { recipientId: userId, isRead: false },
      relations: { sender: true, recipient: true },
    });
    const promises = (await notifications).map((item) => {
      item.isRead = true;
      const res = this.repository.save(item);
      const { recipientId } = item;
      recipientIds.push(recipientId);
      return res;
    });
    const results = await Promise.all(promises);
    if (results.length > 0) this.socket.updateNotification(recipientIds);
    return results;
  }
}
