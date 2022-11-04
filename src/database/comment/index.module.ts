import { Module } from '@nestjs/common';
import { CommentService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './index.entity';
import { AuthModule } from 'src/auth/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
