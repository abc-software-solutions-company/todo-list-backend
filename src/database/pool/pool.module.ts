import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './pool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
