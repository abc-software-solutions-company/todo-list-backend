import { BadRequestException, HttpException, Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/user/user.entity';
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
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly userService: UsersService) {}
  async login(body: LoginDto) {
    const resultEmail = await this.userService.repo.findOneBy({ email: body.email });
    let result: IUser = { email: '', id: '', name: '' };
    if (resultEmail) result = resultEmail;
    else {
      const newUser = await this.userService.create(body);
      if (newUser instanceof HttpException) throw result;
      result = newUser;
    }
    const { id, name, email } = result;
    const payload: IUser = { id, name, email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async verify({ id }: IVerify) {
    if (!id) return new UnauthorizedException();
    const user = await this.usersService.repo.findOneBy({ id });
    if (!user) return new UnauthorizedException();
    return { id: user.id, name: user.name, email: user.email };
  }

  async linkEmail({ email, id }: ILinkEmail) {
    const user = await this.usersService.repo.findOneBy({ id });
    if (!user) return new MethodNotAllowedException();
    user.email = email;
    return this.userService.repo.save(user);
  }
}
