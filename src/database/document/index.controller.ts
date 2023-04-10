import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDocumentDto, UpdateDocumentDto } from './index.dto';
import { DocumentService } from './index.service';

@ApiTags('document')
@ApiBearerAuth()
@Controller('document')
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

  @Get(':id')
  @SkipThrottle()
  async getOne(@Param('id') id: string) {
    return this.service.getOne({ id });
  }

  @Get()
  async getDocuments(@Param('id') todolistId: string) {
    return this.service.findAll(todolistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tree/:todolistID')
  @SkipThrottle()
  async getDocumentTreeByTodolistId(@Param('id') todolistId: string) {
    return this.service.getDocumentTreeByTodolistId(todolistId);
  }
}
