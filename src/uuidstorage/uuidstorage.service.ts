import { Injectable } from '@nestjs/common';
import { CreateUuidstorageDto } from './dto/create-uuidstorage.dto';
import { UpdateUuidstorageDto } from './dto/update-uuidstorage.dto';

@Injectable()
export class UuidstorageService {
  create(createUuidstorageDto: CreateUuidstorageDto) {
    return 'This action adds a new uuidstorage';
  }

  findAll() {
    return `This action returns all uuidstorage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uuidstorage`;
  }

  update(id: number, updateUuidstorageDto: UpdateUuidstorageDto) {
    return `This action updates a #${id} uuidstorage`;
  }

  remove(id: number) {
    return `This action removes a #${id} uuidstorage`;
  }
}
