import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import {UserDto} from 'src/users/dtos/user.dto';
import {UsersService} from 'src/users/users.service';
import {jwtConstants} from '../utils/constants';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, id: string): Promise<any> {
    const user = await this.usersService.findUserByName(username);
    if (user && user.id === id) {
      const {id, userName, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user: CreateUserDto) {
    const newUser = await this.usersService.create(user.userName);
    const payload = {username: newUser.userName, id: newUser.id};
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async authen(token) {
    console.log('🚀 ~ file: auth.service.ts ~ line 33 ~ AuthService ~ authen ~ token', token);
    return this.jwtService.decode(token);
  }

}
