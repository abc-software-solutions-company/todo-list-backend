import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/utils/type';
import { CreateFavoriteDto, UpdateFavoriteDto } from './favorite.dto';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorite')
@Controller('favorites')
export class FavoriteControllers {
  constructor(private readonly service: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateFavoriteDto, @Request() { user: { id: userId } }: IRequest) {
    return this.service.create({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() body: UpdateFavoriteDto, @Request() { user: { id: userId } }: IRequest) {
    return this.service.update({ ...body, userId });
  }
}
