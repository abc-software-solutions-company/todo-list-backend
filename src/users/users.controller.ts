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
import {User} from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/:id')
  async checkUserLogin(@Param('id') id: string) {
    const userExisting = await this.usersService.findUserById(id);
    console.log(userExisting);
    if (userExisting.length == 0) {
      throw new BadRequestException('You must registered a name before enter this page 😵');
    }
    return userExisting[0];
  }

  @Get()
  getAllUser(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    console.log(body.userName.length);
    
    if (body.userName.trim().length == 0) {
      throw new BadRequestException('Name not empty')
    }
    return this.usersService.create(body.userName);
  }
}
