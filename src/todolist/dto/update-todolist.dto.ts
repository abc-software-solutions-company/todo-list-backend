import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTodolistDto {
  @ApiProperty()
  @MinLength(1)
  name: string;
}
