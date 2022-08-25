import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTodolistDto {
  @ApiProperty({
    description: "TodoList Name length must be from 5 to 50 character",
    minLength: 5,
    maxLength: 50,
  })
  @MinLength(5, {
    message: "TodoList Name must at least 5 character",
  })
  @MaxLength(50, {
    message: "TodoList Name cannot be exceed 50 character",
  })
  @IsString()
  listName: string;
}
