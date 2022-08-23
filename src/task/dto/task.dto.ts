import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  task_name: string;
}
