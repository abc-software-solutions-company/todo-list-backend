import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TodoListDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  listName: string;

  @Expose()
  @ApiProperty()
  createdDate: Date;

  @Expose()
  @ApiProperty()
  updatedDate: Date;
}
