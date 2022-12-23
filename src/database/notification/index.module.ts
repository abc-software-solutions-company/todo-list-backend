import { Module } from '@nestjs/common';
import { NotificationService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './index.entity';
import { AuthModule } from 'src/auth/index.module';
import { NotificationController } from './index.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
