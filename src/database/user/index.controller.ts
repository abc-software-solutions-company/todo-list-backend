import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { UpdateUserDto } from './index.dto';
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
  update(@Body() body: UpdateUserDto, @Req() request: IRequest) {
    const { name } = body;
    const { id } = request.user;

    return this.service.update({ id, name });
  }
}
