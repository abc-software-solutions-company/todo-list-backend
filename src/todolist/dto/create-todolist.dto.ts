import { IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTodolistDto {
  @ApiProperty()
  @MinLength(1)
  @IsString()
  name: string;

  userId: string

}
