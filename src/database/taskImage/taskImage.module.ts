import { Module } from '@nestjs/common';
import { TaskImageService } from './taskImage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskImage } from './taskImage.entity';
import { TaskImageControllers } from './taskImage.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskImage]), AuthModule],
  controllers: [TaskImageControllers],
  providers: [TaskImageService],
  exports: [TaskImageService],
})
export class TaskImageModule {}
