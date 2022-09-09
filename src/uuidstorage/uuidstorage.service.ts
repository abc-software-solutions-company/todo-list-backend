import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uuidstorage } from './entities/uuidstorage.entity';

@Injectable()
export class UuidstorageService {
  constructor(@InjectRepository(Uuidstorage) private repo: Repository<Uuidstorage>) {}

  generated1000Record() {
    return this.repo.save({id:"test"})
  }


  findAll() {
    return `This action returns all uuidstorage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uuidstorage`;
  }


  remove(id: number) {
    return `This action removes a #${id} uuidstorage`;
  }
}
