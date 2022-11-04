import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './index.entity';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class PoolService implements OnModuleInit {
  constructor(@InjectRepository(Pool) readonly repository: Repository<Pool>) {}

  onModuleInit() {
    this.generate(1000);
  }

  generateOne(length: number) {
    const shortUniqueId = new ShortUniqueId({ length, dictionary: 'alphanum_lower' });
    const uuid = shortUniqueId();
    return uuid;
  }

  async generate(num: number) {
    let pools = 0;
    let i = 0;
    while (i < num) {
      const pool = new Pool();
      pool.id = this.generateOne(5);
      pool.isUsed = false;
      const save = await this.repository.save(pool);
      if (save) {
        i = i + 1;
        pools = pools + 1;
      }
    }
    return `Generated ${pools} id suceessful`;
  }

  async use() {
    const pool = await this.repository.findOneBy({ isUsed: false });
    pool.isUsed = true;
    return this.repository.save(pool);
  }

  async status() {
    const usage = (await this.repository.findBy({ isUsed: true })).length;
    const all = (await this.repository.find()).length;
    const UsageRate = ((usage * 100) / all || 0).toFixed(2);
    return {
      all,
      usage,
      UsageRate: UsageRate + ' %',
    };
  }
}
