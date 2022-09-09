import { Module } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';
import { UuidstorageController } from './uuidstorage.controller';

@Module({
  controllers: [UuidstorageController],
  providers: [UuidstorageService]
})
export class UuidstorageModule {}
