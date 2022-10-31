import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskImageDto, UpdateTaskImageDto } from './taskImage.dto';
import { TaskImageService } from './taskImage.service';

@ApiTags('TaskImage')
@Controller('taskImages')
export class TaskImageControllers {
  constructor(private readonly service: TaskImageService) {}

  @Get()
  get() {
    return this.service.get();
  }
  @Post()
  create(@Body() body: CreateTaskImageDto) {
    return this.service.create(body);
  }

  @Patch()
  update(@Body() body: UpdateTaskImageDto) {
    return this.service.update(body);
  }
}
