import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/database/user/index.service';
import { IUser } from 'src/utils/type';
import { LoginDto, SyncEmailDto } from './index.dto';
import { IVerify } from './index.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(body: LoginDto) {
    const resultEmail = await this.userService.repository.findOneBy({ email: body.email });
    let result: IUser = { email: '', id: '', name: '' };
    if (resultEmail && body.email === resultEmail.email) result = resultEmail;
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
    if (!id) throw new UnauthorizedException();
    const user = await this.usersService.repository.findOneBy({ id });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, name: user.name, email: user.email };
  }

  async syncEmail(body: SyncEmailDto, { id }: IVerify) {
    console.log(body);
    console.log(id);

    // const resultEmail = await this.userService.repository.findOneBy({ email: body.email });
    // console.log(resultEmail);
  }
}
