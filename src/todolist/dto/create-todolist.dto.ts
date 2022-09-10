import { IsString, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTodolistDto {
  @ApiProperty({
    description: "TodoList Name must not be exceed 100 character",
    maxLength: 100
  })
  @MaxLength(100, {
    message: "TodoList Name must not be exceed 100 character"
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  userId: string

}
