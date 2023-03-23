import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { NotificationService } from './index.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @SkipThrottle()
  async getOne(@Req() request: IRequest) {
    const { id } = request.user;
    return this.service.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @SkipThrottle()
  async update(@Param('id') id: number) {
    return this.service.updateOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateAll(@Req() request: IRequest) {
    const { id } = request.user;
    return this.service.UpdateAll(id);
  }
}
