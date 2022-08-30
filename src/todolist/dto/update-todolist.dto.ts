import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength } from 'class-validator';

export class UpdateTodolistDto {
  @ApiProperty({
    description: 'List Name must not be exceed 25 character',
    maxLength: 25
  })
  @MaxLength(25, {
    message: 'List Name must not be exceed 25 character'
  })
  @IsString()
  listName: string;
}
