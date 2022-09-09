import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';

@Controller('uuidstorage')
export class UuidstorageController {
  constructor(private readonly uuidstorageService: UuidstorageService) {}

  @Post()
  create() {
    return this.uuidstorageService.generated1000Record();
  }

  @Get()
  findAll() {
    return this.uuidstorageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uuidstorageService.findOne(+id);
  }
}
