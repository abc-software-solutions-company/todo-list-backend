import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { FavoriteControllers } from './favorite.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), AuthModule],
  controllers: [FavoriteControllers],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
