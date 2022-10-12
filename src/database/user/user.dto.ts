import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username can not be exceed 32 character',
    maxLength: 32,
  })
  @MinLength(1)
  @MaxLength(32)
  @IsString()
  @MinLength(1)
  name: string;
}
export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @MinLength(1)
  name: string;
}
