import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStatusDto, UpdateStatusDto } from './status.dto';
import { StatusService } from './status.service';

@ApiTags('Status')
@ApiBearerAuth()
@Controller('status')
export class StatusController {
  constructor(private readonly service: StatusService) {}

  @Post('init')
  init() {
    return this.service.init({ todoListId: 'o4urf' });
  }

  @Post()
  create(@Body() body: CreateStatusDto) {
    return this.service.create(body);
  }

  @Patch()
  update(@Body() body: UpdateStatusDto) {
    return this.service.update(body);
  }
}
