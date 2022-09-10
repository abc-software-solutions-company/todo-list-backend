import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Uuidstorage} from './entities/uuidstorage.entity';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class UuidstorageService implements OnModuleInit{
  constructor(@InjectRepository(Uuidstorage) private repo: Repository<Uuidstorage>) {}
  async onModuleInit() {
    console.log('This is uuidstorage service module init');
    console.log(await this.isEmptyRecord());
    const uuidCount = await this.isEmptyRecord();
    const maxUUID = 10000;
    const uidShort = new ShortUniqueId({length: 5});
    if (uuidCount === 0) {
      for (let i =0; i <= maxUUID; i++) {
        await this.repo.save({id: uidShort()});
      }
    }
  }

  async findUnuse() {
    return (await this.repo.findOneOrFail({flag:false}))
  }

  async setFlag(id: string) {
    const uuidRecord = await this.repo.findOne({id:id})
    uuidRecord.flag = true
    return await this.repo.save(uuidRecord);
  }


  async isEmptyRecord() {
    const data = await this.repo.findAndCount();
    return data[1]
  }

  // Find first id don't use
  async findFirstRecordUnused() {
    const data = await this.repo.findOne({'flag':false})
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
