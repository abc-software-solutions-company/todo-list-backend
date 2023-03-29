import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDocumentDto } from './index.dto';
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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @SkipThrottle()
  async getAllDocByTodolist(@Param('id') id: string) {
    const documents = await this.service.findAll({ id });
    const result = documents.map((doc) => this.service.getDocumentTree(doc));
    return result;
  }
}
