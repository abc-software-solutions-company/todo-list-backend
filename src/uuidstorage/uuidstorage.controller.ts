import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';

@Controller('uuidstorage')
export class UuidstorageController {
  constructor(private readonly uuidstorageService: UuidstorageService) {}

  @Post()
  generated1000Record() {
    return this.uuidstorageService.generated1000Record();
  }

  @Get()
  async isEmptyRecord() {
    const data = await this.uuidstorageService.isEmptyRecord();
    console.log("I'm a controller running when start server");
    
    return data[1];
  }
}
