import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/index.module';
import { AttachmentModule } from 'src/database/attachment/index.module';
import { PoolModule } from 'src/database/pool/index.module';
import { TaskModule } from 'src/database/task/index.module';
import { TodolistModule } from 'src/database/todolist/index.module';
import { UserModule } from 'src/database/user/index.module';
import { DevService } from './index.service';

@Module({
  imports: [TaskModule, TodolistModule, PoolModule, UserModule, AttachmentModule, AuthModule],
  providers: [DevService],
  exports: [DevService],
})
export class DevModule {}
