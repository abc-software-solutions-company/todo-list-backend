import { Module } from '@nestjs/common';
import { AttachmentService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './index.entity';
import { AuthModule } from 'src/auth/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment]), AuthModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
