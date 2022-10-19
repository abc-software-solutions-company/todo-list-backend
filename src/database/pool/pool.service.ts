import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './pool.entity';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class PoolService implements OnModuleInit {
  constructor(@InjectRepository(Pool) private readonly repo: Repository<Pool>) {}

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
      const save = await this.repo.save(pool);
      if (save) {
        i = i + 1;
        pools = pools + 1;
      }
    }
    return `Generated ${pools} id suceessful`;
  }

  getOne() {
    return this.repo.findOneBy({ isUsed: false });
  }

  async use(id: string) {
    const pool = await this.repo.findOneBy({ id });
    pool.isUsed = true;
    return this.repo.save(pool);
  }

  async status() {
    const usage = (await this.repo.findBy({ isUsed: true })).length;
    const all = (await this.repo.find()).length;
    const UsageRate = ((usage * 100) / all || 0).toFixed(2);
    return {
      all,
      usage,
      UsageRate: UsageRate + ' %',
    };
  }
}
