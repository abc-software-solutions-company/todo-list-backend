import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Username must between 2 and 30 character",
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @MinLength(2,{
    message: "Username must at lease 2 character"
  })
  @MaxLength(30, {
    message: "Username cannot be over 30 character"
  })
  userName: string;
}
