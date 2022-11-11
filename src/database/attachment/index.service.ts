import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './index.entity';
import { IAttachmentCreate, IAttachmentUpdate } from './index.type';

@Injectable()
export class AttachmentService {
  constructor(@InjectRepository(Attachment) readonly repository: Repository<Attachment>) {}

  create(param: IAttachmentCreate) {
    const { link, name } = param;
    if (!link || !name) throw new BadRequestException();
    const newAttachment = this.repository.create({ ...param });
    return this.repository.save(newAttachment);
  }

  async update(param: IAttachmentUpdate) {
    const { id, taskId, userId, name } = param;
    if (!id || !taskId || !userId) throw new BadRequestException();
    if (name && !name.trim()) throw new BadRequestException('Empty name');
    const attachment = await this.repository.findOneBy({ id, taskId, userId });
    if (!attachment) throw new BadRequestException('not existed');
    const newAttachment = this.repository.create({ ...attachment, ...param });
    return this.repository.save(newAttachment);
  }
}
