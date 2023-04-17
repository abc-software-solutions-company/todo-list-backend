import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  parentId: string;

  @ApiProperty()
  todolistId: string;
}

export class UpdateDocumentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  isActive: boolean;
}
