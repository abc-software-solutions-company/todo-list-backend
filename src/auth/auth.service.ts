import {BadRequestException, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import {UsersService} from 'src/users/users.service';
import { EmailDto } from './dto/email.dto';

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

  async login(createUserDto: CreateUserDto) {
    const {id, userName} = await this.usersService.create(createUserDto.userName);
    const user = {id, userName};
    return {
      accessToken: this.jwtService.sign(user),
      user
    };
  }

  async loginWithGmail(emailDto: EmailDto) {
    try {
      const {id,userName} = await this.usersService.findUserByEmail(emailDto.email)
      const user = {id,userName}
      if (user){
        return {
          accessToken: this.jwtService.sign(user),
          user
        };
      }
    }
    catch {
      throw new BadRequestException("🥲🥲🥲 This Gmail or Email is not registered");
    }

  }

  async authen(token) {
    return this.jwtService.decode(token);
  }
}
