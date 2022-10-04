import {Body, Catch, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags,ApiHeader} from '@nestjs/swagger';
import {CreateUserDto} from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import extractHeader from 'src/utils/extract-header';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {AuthService} from './auth.service';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth User (Created Token)')
@ApiBearerAuth()
@ApiHeader({name:"api_key"})
@Controller('auth')
@Catch(QueryFailedError, EntityNotFoundError)
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}
  @Post('/login')
  async checkUserLogin(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/gmail-login',)
  async checkUserGmailLogin(@Body() emailDto: EmailDto) {
    return this.authService.loginWithGmail(emailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async getUserProfile(@Req() request: any) {
    const {userName,userId} = extractHeader(request);
    // Read Email
    const email = await this.authService.readEmail(userId);
    return {userName,userId,email}
  }

  @UseGuards(JwtAuthGuard)
  @Post('/attach_email')
  async abc(@Req() request: any, @Body() emailDto: EmailDto) {
    const {userId} = extractHeader(request);
    return this.userService.attachEmail(emailDto.email,userId);
  }
}
