import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LinkEmailDto {
  @ApiProperty({ example: 'email@mail.com' })
  @IsEmail()
  email: string;
}

export class LoginDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'email' })
  email: string;
}
