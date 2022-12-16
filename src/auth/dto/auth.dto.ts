import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'token' })
  @IsNotEmpty()
  access_token: string;
}
