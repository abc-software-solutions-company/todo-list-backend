import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './index.entity';
import { uuid } from 'uuidv4';

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
    if (name.trim().length === 0) throw new BadRequestException();
    let i = 0;
    while (i < 3) {
      const id = uuid();
      try {
        const user = this.repository.create({ name, id, email });
        return this.repository.save(user);
      } catch {
        i = i + 1;
      }
    }
    throw new BadRequestException();
  }
}
