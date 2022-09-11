import { Module } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uuidstorage } from './entities/uuidstorage.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Uuidstorage])],
  providers: [UuidstorageService]
})
export class UuidstorageModule {}
