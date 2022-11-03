import { Module } from '@nestjs/common';
import { PoolService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './index.entity';
import { PoolControllers } from './index.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  controllers: [PoolControllers],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
