import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
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
}
