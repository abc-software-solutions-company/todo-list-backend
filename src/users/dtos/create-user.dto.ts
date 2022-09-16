import { IsString, MaxLength, MinLength, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Username can not be exceed 35 character",
    maxLength: 35,
  })
  @MinLength(1)
  @MaxLength(35)
  @IsString()
  @MinLength(1)
  userName: string;
}
