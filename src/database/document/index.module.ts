import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentController } from './index.controller';
import { Document } from './index.entity';
import { DocumentService } from './index.service';
import { TodolistModule } from '../todolist/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), forwardRef(() => TodolistModule), TodolistModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
