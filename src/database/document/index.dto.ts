import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  idParent: string;

  @ApiProperty()
  todolistId: string;
}
