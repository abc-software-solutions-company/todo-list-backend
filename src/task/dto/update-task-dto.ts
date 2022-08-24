import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  taskName: string;
}
