import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDocumentDto, UpdateDocumentDto } from './index.dto';
import { DocumentService } from './index.service';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateDocumentDto) {
    return this.service.create({ ...body });
  }

  @Patch('update')
  @SkipThrottle()
  async Update(@Body() body: UpdateDocumentDto) {
    return this.service.update({ ...body });
  }

  @Patch('handle-favorite/:documentId')
  @SkipThrottle()
  async handleFavorite(@Param('documentId') documentId: string) {
    return this.service.handleFavorite(documentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tree/:todolistId')
  @SkipThrottle()
  async getDocumentTreeByTodolistId(@Param('todolistId') todolistId: string) {
    return this.service.getDocumentTreeByTodolistId(todolistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorite/:todolistId')
  @SkipThrottle()
  async getDocumentsFavorite(@Param('todolistId') todolistId: string) {
    return this.service.getDocumentsFavorite(todolistId);
  }

  @Get(':id')
  @SkipThrottle()
  async getOne(@Param('id') id: string) {
    return this.service.getOne({ id });
  }
}
