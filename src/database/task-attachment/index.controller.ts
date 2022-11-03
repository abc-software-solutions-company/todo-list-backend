import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskAttachmentDto, UpdateTaskAttachmentDto } from './index.dto';
import { TaskAttachmentService } from './index.service';

@ApiTags('TaskAttachment')
@Controller('task-attachment')
export class TaskAttachmentControllers {
  constructor(private readonly service: TaskAttachmentService) {}

  @Get()
  get() {
    return this.service.get();
  }
  @Post()
  create(@Body() body: CreateTaskAttachmentDto) {
    return this.service.create(body);
  }

  @Patch()
  update(@Body() body: UpdateTaskAttachmentDto) {
    return this.service.update(body);
  }
}
