import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({
    description: "Task name must be between 5 to 100 character",
    minLength: 5,
    maxLength: 100,
  })
  @MinLength(5, {
    message: "Task name must at least 5 character",
  })
  @MaxLength(100, {
    message: "Task name cannot be exceed 100 character",
  })
  @IsString()
  taskName: string;

  @ApiProperty({
    description: "UserId must be UUID and required"
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "todolistId must be number and required"
  })
  @IsNumber()
  todolistId: number;
}
