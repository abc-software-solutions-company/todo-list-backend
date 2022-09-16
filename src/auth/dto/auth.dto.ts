import { ApiProperty } from "@nestjs/swagger";
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({example: 'token'})
  @IsString()
  access_token: string;
}
