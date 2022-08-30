import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTodolistDto {
  @ApiProperty({
    description: "TodoList Name must not be exceed 25 character",
    maxLength: 25
  })
  @MaxLength(25, {
    message: "TodoList Name must not be exceed 25 character"
  })
  @IsString()
  listName: string;
}
