import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/index.module';
import { Status } from './index.entity';
import { StatusService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status]), AuthModule],
  // controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
