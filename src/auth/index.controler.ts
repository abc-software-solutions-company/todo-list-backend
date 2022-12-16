import { Body, Controller, Get, HttpException, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from 'src/utils/type';
import { LoginDto } from './index.dto';
import { AuthService } from './index.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  login(@Body() param: LoginDto) {
    return this.authService.login(param);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verify(@Req() { user: { id } }: IRequest) {
    const result = await this.authService.verify({ id });
    if (result instanceof HttpException) throw result;
    return result;
  }

  @Patch()
  update(@Body() param: LoginDto) {
    return this.authService.login(param);
  }
}
