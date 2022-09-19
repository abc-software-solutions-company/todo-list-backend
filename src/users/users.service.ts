import {BadRequestException, Injectable, NotAcceptableException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async create(userName: string): Promise<User> {
    if (userName.trim().length !== 0) {
      const user = this.repo.create({userName});
      return this.repo.save(user);
    } else throw new NotAcceptableException('Username must have 1 character');
  }

  async findUserById(id: string) {
    const firstUser = await this.repo.find({id: id});
    return firstUser;
  }

  async findUserByName(userName: string) {
    const firstUser = await this.repo
      .createQueryBuilder('user')
      .where('user.userName = :userName', {userName: userName})
      .getOne();
    return firstUser;
  }
}
