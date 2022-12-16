import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './index.entity';
import { StatusService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
