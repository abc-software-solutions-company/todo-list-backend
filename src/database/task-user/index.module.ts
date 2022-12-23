import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/index.module';
import { UserModule } from '../user/index.module';
import { TaskUser } from './index.entity';
import { TaskUserService } from './index.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskUser]), UserModule, NotificationModule],
  providers: [TaskUserService],
  exports: [TaskUserService],
})
export class TaskUserModule {}
