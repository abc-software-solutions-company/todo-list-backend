import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/database/user/user.dto';
import extractHeader from 'src/utils/extract-header';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth User (Created Token)')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  async getUserProfile(@Req() request: any) {
    const { name, userId } = extractHeader(request);
    // Read Email
    const email = await this.authService.readEmail(userId);
    return { name, userId, email };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/attach_email')
  async abc(@Req() request: any, @Body() emailDto: EmailDto) {
    const { userId } = extractHeader(request);
    return this.userService.attachEmail(emailDto.email, userId);
  }
}
