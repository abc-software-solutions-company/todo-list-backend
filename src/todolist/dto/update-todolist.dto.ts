import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength } from 'class-validator';

export class UpdateTodolistDto {
  @ApiProperty({
    description: 'List Name must not be exceed 100 character',
    maxLength: 100
  })
  @MaxLength(100, {
    message: 'List Name must not be exceed 100 character'
  })
  name: string;
}
