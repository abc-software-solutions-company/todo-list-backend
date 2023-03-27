import { Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/database/user/index.service';
import { IUser } from 'src/utils/type';
import { LoginDto } from './index.dto';
import { IVerify } from './index.type';
import { defineAll } from '../utils/function';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async login(body: LoginDto) {
    if (!defineAll(body.name)) throw new MethodNotAllowedException('Login failed, name not empty');
    let user: IUser;
    if (body.email) user = await this.userService.repository.findOneBy({ email: body.email });
    // FIX Duplicate email account in user table
    if (!user?.email) {
      user = await this.userService.create(body);
    }
    const { id, name, email } = user;
    const payload: IUser = { id, name, email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async verify({ id }: IVerify) {
    if (!id) throw new UnauthorizedException();
    const user = await this.userService.repository.findOneBy({ id });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, name: user.name, email: user.email };
  }
}
