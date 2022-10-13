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
    throw new Error();
  }

  async findUserById(id: string) {
    const firstUser = await this.repo.findOneBy({ id: id });
    return firstUser;
  }

  async attachEmail(email: string, id: string) {
    const emailExisted = await this.repo.findBy({ email: email });
    const currentUser = await this.repo.findOneBy({ id: id });
    // If user already have email block this function
    if (emailExisted.length > 0) throw new BadRequestException('🥵 This user already have email linked');
    else {
      currentUser.email = email;
      return await this.repo.save(currentUser);
    }
  }
}
