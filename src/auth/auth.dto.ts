import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LinkEmailDto {
  @ApiProperty({ example: 'email' })
  email: string;
}

export class LoginDto extends LinkEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
