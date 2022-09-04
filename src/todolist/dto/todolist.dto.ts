import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TodoListDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  createdDate: Date;

  @Expose()
  @ApiProperty()
  updatedDate: Date;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  userId: string;
}
