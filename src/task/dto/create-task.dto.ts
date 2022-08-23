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
    description: "Task name must be between 5 to 50 character",
    minLength: 5,
    maxLength: 50,
  })
  @MinLength(5, {
    message: "Task name must at least 5 character",
  })
  @MaxLength(50, {
    message: "Task name cannot be exceed 50 character",
  })
  @IsString()
  task_name: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNumber()
  todolistId: number;
}
