import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';

export class CreateTodolistDto {
  @ApiProperty()
  @MinLength(1)
  @IsString()
  name: string;

  userId: string;
}
export class UpdateTodolistDto {
  @ApiProperty()
  @MinLength(1)
  name: string;
}
export class TodoListDto {
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
