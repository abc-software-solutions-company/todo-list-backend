import { IsString, MaxLength, MinLength, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Username can not be exceed 32 character",
    maxLength: 32,
  })
  @MinLength(1)
  @MaxLength(32)
  @IsString()
  @MinLength(1)
  userName: string;
  
}
