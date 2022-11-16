import { ApiProperty } from '@nestjs/swagger';

export class CreateTodolistDto {
  @ApiProperty()
  name: string;
}

export class UpdateTodolistDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  visibility: string;
}
