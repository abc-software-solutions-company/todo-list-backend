import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './pool.entity';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class PoolService implements OnModuleInit {
  constructor(@InjectRepository(Pool) private readonly repo: Repository<Pool>) {}

  async onModuleInit() {
    const uuidCount = await this.isEmptyRecord();
    const maxUUID = 1000;
    const uidShort = new ShortUniqueId({ length: 5, dictionary: 'alphanum_lower' });
    if (uuidCount === 0) {
      for (let i = 0; i <= maxUUID; i++) {
        await this.repo.save({ id: uidShort() });
      }
    }
  }

  async findUnuse() {
    const data = await this.repo.findOneBy({ isUsed: false });
    return data;
  }

  async setFlag(id: string) {
    const uuidRecord = await this.repo.findOneBy({ id: id });
    uuidRecord.isUsed = true;
    return await this.repo.save(uuidRecord);
  }

  async isEmptyRecord() {
    const data = await this.repo.findAndCount();
    return data[1];
  }
}
