import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { uuid } from 'uuidv4';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async validUserId(id: string) {
    // Check if userId existed
    const userIdExisted = await this.repo.countBy({ id: id });
    if (userIdExisted >= 1) return false;
    return true;
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async create(name: string): Promise<User> {
    // create userId
    let userId = uuid();
    while ((await this.validUserId(userId)) == false) userId = uuid();

    if (name.trim().length !== 0) {
      const user = this.repo.create({ name: name, id: userId });
      return this.repo.save(user);
    } else throw new NotAcceptableException('Username must have 1 character');
  }

  async findUserById(id: string) {
    const firstUser = await this.repo.findBy({ id: id });
    return firstUser;
  }

  async findUserByEmail(email: string) {
    const firstUser = await this.repo.findOneBy({ email: email });
    return firstUser;
  }

  async findUserByName(name: string) {
    const firstUser = await this.repo.createQueryBuilder('user').where('user.name = :name', { name: name }).getOne();
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
