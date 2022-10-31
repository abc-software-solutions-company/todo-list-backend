import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateImageDto } from './image.dto';
import { ImageService } from './image.service';

@ApiTags('Image')
@Controller('images')
export class ImageControllers {
  constructor(private readonly service: ImageService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Post()
  create(@Body() body: CreateImageDto) {
    return this.service.create(body);
  }
}
