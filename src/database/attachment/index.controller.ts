import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './index.service';

@ApiTags('Attachment')
@Controller('attachments')
export class AttachmentControllers {
  constructor(private readonly service: AttachmentService) {}
}
