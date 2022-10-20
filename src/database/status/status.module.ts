import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Status } from './status.entity';
import { StatusService } from './status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status]), AuthModule],
  // controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
