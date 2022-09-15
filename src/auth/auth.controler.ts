import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import extractHeader from 'src/utils/extract-header';
import {AuthService} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('User (Created Token)')
@ApiBearerAuth()
@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async checkUserLogin(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProfile(@Req() request: any) {
    const {userName} = extractHeader(request);
    return userName
  }
}
