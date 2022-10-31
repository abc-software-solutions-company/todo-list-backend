import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { IImageCreate, IImageUpdate } from './image.type';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(Image) readonly repository: Repository<Image>) {}

  get() {
    return this.repository.find({ relations: { taskImages: true } });
  }

  create(param: IImageCreate) {
    const { link } = param;
    if (!link) throw new BadRequestException();
    const newImage = this.repository.create({ link, isActive: true });
    return this.repository.save(newImage);
  }

  async update(param: IImageUpdate) {
    const { id } = param;
    if (!id) throw new BadRequestException();
    const image = await this.repository.findOneBy({ id });
    if (!image) throw new BadRequestException();
    const newImage = this.repository.create(param);
    return this.repository.save(newImage);
  }
}
