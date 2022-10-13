import { Body, Controller, Get, MethodNotAllowedException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from 'src/utils/type';
import { LinkEmailDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth User (Created Token)')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() param: LoginDto) {
    return this.authService.login(param);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify')
  async verify(@Req() { user: { id } }: IRequest) {
    console.log();

    const result = await this.authService.verify({ id });
    if (result === UnauthorizedException) throw new UnauthorizedException();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/linkEmail')
  async linkEmail(@Req() { user: { id } }: IRequest, @Body() { email }: LinkEmailDto) {
    const result = await this.authService.linkEmail({ id, email });
    if (result === MethodNotAllowedException) throw new MethodNotAllowedException();
  }
}
