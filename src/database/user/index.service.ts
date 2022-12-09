import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './index.entity';
import { v4 } from 'uuid';
import { IUserUpdate } from './index.type';
import { defineAll, defineAny } from 'src/utils/function';

interface ICreate {
  name: string;
  email: string;
}
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) readonly repository: Repository<User>) {}

  getIndentify() {
    return this.repository.find({ where: { email: Not(IsNull()) }, select: { id: true, name: true, email: true } });
  }

  async create({ name, email }: ICreate) {
    if (!name || (name && !name.trim())) throw new BadRequestException();
    const id = v4();
    const user = this.repository.create({ name, id, email });
    return this.repository.save(user);
  }

  async update({ id, name }: IUserUpdate) {
    if (!defineAll(id, name)) throw new BadRequestException('User update Err param');

    const user = await this.repository.findOneBy({ id });

    if (defineAny(name)) {
      if (name) {
        if (!name.trim()) throw new BadRequestException('Empty name');
        user.name = name;
      }

      await this.repository.save(user);
    }

    return user;
  }
}
