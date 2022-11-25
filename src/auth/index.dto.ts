import { ApiProperty } from '@nestjs/swagger';

export class SyncEmailDto {
  @ApiProperty({ example: 'email@mail.com' })
  email: string;
  @ApiProperty({ example: 'guestAccountUserId' })
  id: string;
}

export class LoginDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'email' })
  email: string;
}
