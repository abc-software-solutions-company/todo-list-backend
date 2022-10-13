import { Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/database/user/users.service';
import { IUser } from 'src/utils/type';
import { LoginDto } from './auth.dto';

interface IVerify {
  id: string;
}
interface ILinkEmail extends IVerify {
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async login({ name, email }: LoginDto) {
    const { id } = await this.usersService.create({ name, email });
    const payload: IUser = { id, name, email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async verify({ id }: IVerify) {
    if (!id) return UnauthorizedException;
    const user = await this.usersService.repo.findOneBy({ id });
    console.log(user);

    if (!user) return UnauthorizedException;
    return { id: user.id, name: user.name, email: user.email };
  }

  async linkEmail({ email, id }: ILinkEmail) {
    const user = await this.usersService.repo.findOneBy({ id });
    if (!user) return MethodNotAllowedException;
    user.email = email;
    return this.userService.repo.save(user);
  }
}
