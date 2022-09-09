import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UuidstorageService } from './uuidstorage.service';
import { CreateUuidstorageDto } from './dto/create-uuidstorage.dto';
import { UpdateUuidstorageDto } from './dto/update-uuidstorage.dto';

@Controller('uuidstorage')
export class UuidstorageController {
  constructor(private readonly uuidstorageService: UuidstorageService) {}

  @Post()
  create(@Body() createUuidstorageDto: CreateUuidstorageDto) {
    return this.uuidstorageService.create(createUuidstorageDto);
  }

  @Get()
  findAll() {
    return this.uuidstorageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uuidstorageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUuidstorageDto: UpdateUuidstorageDto) {
    return this.uuidstorageService.update(+id, updateUuidstorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uuidstorageService.remove(+id);
  }
}
