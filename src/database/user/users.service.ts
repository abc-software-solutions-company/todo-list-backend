import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { uuid } from 'uuidv4';

interface ICreate {
  name: string;
  email: string;
}
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) readonly repo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async create({ name, email }: ICreate) {
    if (name.trim().length === 0) return new BadRequestException();
    let i = 0;
    while (i < 3) {
      const id = uuid();
      try {
        const user = this.repo.create({ name, id, email });
        return this.repo.save(user);
      } catch {
        i = i + 1;
      }
    }
    return new BadRequestException();
  }
}
