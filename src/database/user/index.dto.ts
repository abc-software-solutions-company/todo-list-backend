import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  name: string;
}

export class SeedUserDto {
  @ApiProperty()
  emailContainName?: boolean;
  @ApiProperty({ default: 5 })
  quantity: number;
}
