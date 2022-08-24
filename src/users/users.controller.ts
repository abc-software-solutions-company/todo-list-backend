import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user-dto';
import {UserDto} from './dtos/user.dto';
import {UsersService} from './users.service';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {User} from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAllUser(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const existUser = await this.usersService.findUserByName(body.userName).then(result => {
      return result;
    });

    if (existUser !== undefined) {
      throw new BadRequestException('This user already existing');
    }
    return this.usersService.create(body.userName);
  }
}
