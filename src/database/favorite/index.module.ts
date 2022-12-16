import { Module } from '@nestjs/common';
import { FavoriteService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './index.entity';
import { AuthModule } from 'src/auth/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), AuthModule],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
