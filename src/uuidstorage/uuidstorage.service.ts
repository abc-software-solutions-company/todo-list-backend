import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Uuidstorage} from './entities/uuidstorage.entity';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class UuidstorageService implements OnModuleInit {
  constructor(@InjectRepository(Uuidstorage) private repo: Repository<Uuidstorage>) {}
  async onModuleInit() {
    const uuidCount = await this.isEmptyRecord();
    const maxUUID = 100000;
    const uidShort = new ShortUniqueId({length: 5, dictionary: 'alphanum_lower'});
    if (uuidCount === 0) {
      for (let i = 0; i <= maxUUID; i++) {
        await this.repo.save({id: uidShort()});
      }
    }
  }

  async findUnuse() {   return await this.repo.findOneOrFail({flag: false});  }

  async setFlag(id: string) {
    const uuidRecord = await this.repo.findOne({id: id});
    uuidRecord.flag = true;
    return await this.repo.save(uuidRecord);
  }

  async isEmptyRecord() {
    const data = await this.repo.findAndCount();
    return data[1];
  }

  // Find first id don't use
  async findFirstRecordUnused() {
    const data = await this.repo.findOne({flag: false});
    return data;
  }

  // Count available uuid (flag: false)
  async countAvailableUuid() {
    const data = await this.repo.findAndCount({flag: false});
    return data[1];
  }

  // count all uuid {
  async countAllUuid() {
    const data = await this.repo.findAndCount();
    return data[1];
  }

  // Scale up uuid storage
  async scaleUpUUID() {
    const uidShort = new ShortUniqueId({length: 5, dictionary: 'alphanum_lower'});
    const availableCount = await this.countAvailableUuid();
    const allCount = await this.countAllUuid();
    if (availableCount / allCount <= 0.3) {
      for (let i = 0; i <= 1000; i++) {
        const uuidGen = uidShort();
        const uuidDuplicate = await this.repo.findOne({id: uidShort()});
        if (!uuidDuplicate) {   await this.repo.save({id: uuidGen});  }
      }
    }
  }
}
