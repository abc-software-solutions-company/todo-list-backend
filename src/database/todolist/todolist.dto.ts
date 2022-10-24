import { ApiProperty } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty()
  name: string;
}

export class UpdateListDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  visibility: string;
}
