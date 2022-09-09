import { Module } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';
import { UuidstorageController } from './uuidstorage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuidstorage } from './entities/uuidstorage.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Uuidstorage])],
  controllers: [UuidstorageController],
  providers: [UuidstorageService]
})
export class UuidstorageModule {}
