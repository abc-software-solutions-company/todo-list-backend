import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './index.entity';
import { v4 } from 'uuid';

interface ICreate {
  name: string;
  email: string;
}
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) readonly repository: Repository<User>) {}

  async findAll() {
    return this.repository.find();
  }

  async create({ name, email }: ICreate) {
    if (name.trim()) throw new BadRequestException();
    const id = v4();
    const user = this.repository.create({ name, id, email });
    return this.repository.save(user);
  }
}
