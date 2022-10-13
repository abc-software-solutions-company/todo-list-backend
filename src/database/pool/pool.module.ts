import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './pool.entity';
import { PoolControllers } from './pool.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  controllers: [PoolControllers],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
