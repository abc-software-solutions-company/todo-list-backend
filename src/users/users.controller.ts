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
import {UserDto} from './dtos/user.dto';
import {UsersService} from './users.service';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {User} from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/:userID')
  async checkUserLogin(@Param('userID') userID: string) {
    const userExisting = await this.usersService.findUserById(userID);
    if (!userExisting) {
      throw new BadRequestException('You must registered a name before enter this page 😵');
    }
    return 'loggin ok 😺';
  }

  @Get()
  getAllUser(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.userName);
  }
}
