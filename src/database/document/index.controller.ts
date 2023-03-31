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

  @Get()
  @SkipThrottle()
  async get() {
    return this.service.get();
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

  @UseGuards(JwtAuthGuard)
  @Get('/list-document/:id')
  @SkipThrottle()
  async getAllDocByTodolist(@Param('id') id: string) {
    const documents = await this.service.findAll(id);
    const result = documents.map((doc) => this.service.getDocumentTree(doc));
    return result;
  }
}
