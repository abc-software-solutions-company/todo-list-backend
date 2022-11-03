import { Module } from '@nestjs/common';
import { FavoriteService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './index.entity';
import { FavoriteControllers } from './index.controller';
import { AuthModule } from 'src/auth/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), AuthModule],
  controllers: [FavoriteControllers],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
