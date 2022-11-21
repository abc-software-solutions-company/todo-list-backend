import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { UserService } from './index.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('identify')
  @SkipThrottle()
  async getIndentify() {
    return this.service.getIndentify();
  }
}
