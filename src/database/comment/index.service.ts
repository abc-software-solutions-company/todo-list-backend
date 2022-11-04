import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './index.entity';
import { ICommentCreate, ICommentUpdate } from './index.type';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) readonly repository: Repository<Comment>) {}

  create(param: ICommentCreate) {
    const { comment, userId, taskId } = param;
    if (!comment || !userId || !taskId) throw new BadRequestException();
    const newComment = this.repository.create({ ...param });
    return this.repository.save(newComment);
  }

  async update(param: ICommentUpdate) {
    const { id, userId, taskId } = param;
    if (!id || !userId || !taskId) throw new BadRequestException();
    const comment = await this.repository.findOneBy({ id, userId, taskId });
    if (!comment) throw new BadRequestException();
    const newComment = this.repository.create(param);
    return this.repository.save(newComment);
  }
}
