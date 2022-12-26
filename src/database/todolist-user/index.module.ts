import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/index.module';
import { UserModule } from '../user/index.module';
import { TodolistUser } from './index.entity';
import { TodolistUserService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodolistUser]), NotificationModule, UserModule],
  providers: [TodolistUserService],
  exports: [TodolistUserService],
})
export class TodolistUserModule {}
