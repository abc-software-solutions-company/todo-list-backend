import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty()
  link: string;
}
