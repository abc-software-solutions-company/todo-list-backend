import {Body, Catch, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import extractHeader from 'src/utils/extract-header';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {AuthService} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth User (Created Token)')
@ApiBearerAuth()
@Controller('auth')
@Catch(QueryFailedError, EntityNotFoundError)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  async checkUserLogin(@Body() userDto: CreateUserDto) {
    console.log(`😀Created Access Token for userName: ${userDto.userName} `);
    return this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async getUserProfile(@Req() request: any) {
    console.log('😀Decode User Info from Access Token');
    const {userName,userId} = extractHeader(request);
    return {userName,userId}
  }

  @UseGuards(JwtAuthGuard)
  @Get('/attach_email;')
  async abc(@Req() request: any) {
    console.log('😀Decode User Info from Access Token');
    const {userName,userId} = extractHeader(request);
    return {userName,userId}
  }
}
