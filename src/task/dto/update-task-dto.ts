import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
  @ApiProperty()
  @IsString()
  taskName: string;
}
