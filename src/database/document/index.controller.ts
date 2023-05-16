import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Patch, Req } from '@nestjs/common/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDocumentDto, UpdateDocumentDto } from './index.dto';
import { DocumentService } from './index.service';
import { IRequest } from 'src/utils/type';

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

  @UseGuards(JwtAuthGuard)
  @Get('/tree/:todolistId')
  @SkipThrottle()
  async getDocumentTreeByTodolistId(@Req() request: IRequest, @Param('todolistId') todolistId: string) {
    const { id: userId } = request.user;
    return this.service.getDocumentTreeByTodolistId(todolistId, userId);
  }

  @Get(':id')
  @SkipThrottle()
  async getOne(@Param('id') id: string) {
    return this.service.getOne({ id });
  }
}
