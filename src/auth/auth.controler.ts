import {Body, Catch, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import extractHeader from 'src/utils/extract-header';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {AuthService} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('User (Created Token)')
@ApiBearerAuth()
@Controller('users')
@Catch(QueryFailedError, EntityNotFoundError)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async checkUserLogin(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProfile(@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    return {userName,userId}
  }
}
