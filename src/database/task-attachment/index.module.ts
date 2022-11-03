import { Module } from '@nestjs/common';
import { TaskAttachmentService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAttachment } from './index.entity';
import { AuthModule } from 'src/auth/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAttachment]), AuthModule],
  // controllers: [TaskAttachmentControllers],
  providers: [TaskAttachmentService],
  exports: [TaskAttachmentService],
})
export class TaskAttachmentModule {}
