import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageControllers } from './image.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), AuthModule],
  controllers: [ImageControllers],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
