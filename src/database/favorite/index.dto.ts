import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty()
  todolistId: string;
}

export class UpdateFavoriteDto extends CreateFavoriteDto {
  @ApiProperty()
  todolistId: string;
  @ApiProperty()
  isActive: boolean;
}
