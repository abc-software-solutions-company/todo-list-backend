import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { SeedUserDto, UpdateUserDto } from './index.dto';
import { UserService } from './index.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('identify')
  @SkipThrottle()
  async getIndentify() {
    return this.service.getIndentify();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() { name }: UpdateUserDto, @Req() { user: { id } }: IRequest) {
    return this.service.update({ id, name });
  }

  @Post('/seedUser')
  seedUser(@Body() { quantity, emailContainName }: SeedUserDto) {
    return this.service.seedUser({ quantity, emailContainName });
  }
}
