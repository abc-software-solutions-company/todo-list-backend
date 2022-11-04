import { Module } from '@nestjs/common';
import { TodolistService } from './index.service';
import { TodolistController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todolist } from './index.entity';
import { AuthModule } from 'src/auth/index.module';
import { PoolModule } from '../pool/index.module';
import { StatusModule } from '../status/index.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todolist]), PoolModule, StatusModule, AuthModule],
  controllers: [TodolistController],
  providers: [TodolistService],
  exports: [TodolistService],
})
export class TodolistModule {}