import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/database/user/user.dto';
import { UsersService } from 'src/database/user/users.service';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, id: string) {
    const user = await this.usersService.findUserByName(username);
    if (user && user.id === id) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(createUserDto: CreateUserDto) {
    const { id, name, email } = await this.usersService.create(createUserDto.name);
    const user = { id, name, email };
    return {
      accessToken: this.jwtService.sign(user),
      user,
    };
  }

  async loginWithGmail(emailDto: EmailDto) {
    try {
      const { id, name, email } = await this.usersService.findUserByEmail(emailDto.email);
      const user = { id, name, email };
      if (user) {
        return {
          accessToken: this.jwtService.sign(user),
          user,
        };
      }
    } catch {
      throw new BadRequestException('🥲🥲🥲 This Gmail or Email is not registered');
    }
  }

  async readEmail(userId: string) {
    const email = await this.usersService.findUserById(userId);
    return email[0].email;
  }

  async authen(token: string) {
    return this.jwtService.decode(token);
  }
}
