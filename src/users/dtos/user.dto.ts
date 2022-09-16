import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from 'class-validator';

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  @MinLength(1)
  userName: string;
}
