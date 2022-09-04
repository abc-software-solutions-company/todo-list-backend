import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  isDone: boolean;

  @Expose()
  @ApiProperty()
  createdDate: Date;
}
