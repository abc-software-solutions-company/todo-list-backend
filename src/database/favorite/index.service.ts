import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './index.entity';
import { IFavoriteSet } from './index.type';

@Injectable()
export class FavoriteService {
  constructor(@InjectRepository(Favorite) readonly repository: Repository<Favorite>) {}

  set({ userId, todolistId, isActive }: IFavoriteSet) {
    if (!userId || !todolistId || isActive === undefined) throw new BadRequestException('Set Favorite Err Param');
    const favorite = this.repository.create({ userId, todolistId, isActive });
    return this.repository.save(favorite);
  }
}
