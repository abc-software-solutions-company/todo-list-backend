import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty()
  link: string;

  @ApiProperty()
  name: string;
}
