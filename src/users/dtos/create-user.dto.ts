import { IsString, MaxLength, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Username can not be exceed 35 character",
    maxLength: 35,
  })
  @MaxLength(35, {
    message: "Username can not be exceed 35 character"
  })
  @IsString()
  userName: string;
}
