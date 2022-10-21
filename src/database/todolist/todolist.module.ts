import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todolist } from './todolist.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PoolModule } from '../pool/pool.module';
import { StatusModule } from '../status/status.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todolist]), PoolModule, StatusModule, AuthModule],
  controllers: [TodolistController],
  providers: [TodolistService],
  exports: [TodolistService],
})
export class TodolistModule {}
