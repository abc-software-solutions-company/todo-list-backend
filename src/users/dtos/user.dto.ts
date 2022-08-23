import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  user_name: string;
}
