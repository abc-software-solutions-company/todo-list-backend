import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './index.entity';
import { IFavoriteCreate, IFavoriteUpdate } from './index.type';

@Injectable()
export class FavoriteService {
  constructor(@InjectRepository(Favorite) private readonly repository: Repository<Favorite>) {}

  async create({ userId, todolistId }: IFavoriteCreate) {
    if (!userId || !todolistId) throw new BadRequestException();
    const favorite = await this.repository.findOneBy({ userId, todolistId });
    if (favorite) return this.update({ userId, todolistId, isActive: true });
    const newFavorite = this.repository.create({ userId, todolistId, isActive: true });
    return this.repository.save(newFavorite);
  }

  async update({ userId, todolistId, isActive }: IFavoriteUpdate) {
    if (!userId || !todolistId || isActive === undefined) throw new BadRequestException();
    const favorite = await this.repository.findOneBy({ userId, todolistId });
    if (isActive === favorite.isActive) throw new BadRequestException();
    favorite.isActive = isActive;
    return this.repository.save(favorite);
  }
}
