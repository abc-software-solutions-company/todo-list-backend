import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/database/user/user.dto';
import { UsersService } from 'src/database/user/users.service';
import extractHeader from 'src/utils/extract-header';
import { IRequest } from 'src/utils/type';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth User (Created Token)')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}
  @Post('/login')
  async checkUserLogin(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/gmail-login')
  async checkUserGmailLogin(@Body() emailDto: EmailDto) {
    return this.authService.loginWithGmail(emailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async getUserProfile(@Req() request: IRequest) {
    const { userId } = request.user;

    const user = await this.userService.findUserById(userId);
    if (user) {
      const { email, name, id } = user;
      return { email, name, id };
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/attach_email')
  async abc(@Req() request: any, @Body() emailDto: EmailDto) {
    const { userId } = extractHeader(request);
    return this.userService.attachEmail(emailDto.email, userId);
  }
}
