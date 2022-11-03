import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAttachmentDto } from './index.dto';
import { AttachmentService } from './index.service';

@ApiTags('Attachment')
@Controller('attachments')
export class AttachmentControllers {
  constructor(private readonly service: AttachmentService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Post()
  create(@Body() body: CreateAttachmentDto) {
    return this.service.create(body);
  }
}
