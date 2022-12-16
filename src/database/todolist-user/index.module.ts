import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/index.module';
import { TodolistUser } from './index.entity';
import { TodolistUserService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodolistUser]), UserModule],
  providers: [TodolistUserService],
  exports: [TodolistUserService],
})
export class TodolistUserModule {}
