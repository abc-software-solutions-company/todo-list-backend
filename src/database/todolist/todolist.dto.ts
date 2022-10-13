import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmpty } from 'class-validator';

export class CreateListDto {
  @ApiProperty()
  @MinLength(1)
  @IsEmpty()
  name: string;
}
export class UpdateListDto {
  @ApiProperty()
  @MinLength(1)
  @IsEmpty()
  id: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty()
  isDone?: boolean;
}

export class ListDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  updatedDate: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  userId: string;
}
