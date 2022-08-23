import {
  NotAcceptableException,
  Injectable,
  NotFoundException,
  HttpCode,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async create(user_name: string): Promise<User> {
    const user = this.repo.create({ user_name });

    return this.repo.save(user);
  }

  async findUserById(id: string) {
    const firstUser = await this.repo
      .createQueryBuilder("user")
      .where("user.id = :id", { id: id })
      .getOne();
    return firstUser;
  }

  async findUserByName(user_name: string) {
    const firstUser = await this.repo
      .createQueryBuilder("user")
      .where("user.user_name = :user_name", { user_name: user_name })
      .getOne();
    return firstUser;
  }
}
