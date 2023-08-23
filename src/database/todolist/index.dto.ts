import { ApiProperty } from '@nestjs/swagger';
import { ITodolistMember } from './index.type';

export class CreateTodolistDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  taskSymbol: string;

  @ApiProperty()
  taskSymBol?: string;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  member: ITodolistMember;
}

export class SyncTodolistDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

export class UpdateTodolistDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  favorite: boolean;

  @ApiProperty()
  taskSymBol?: string;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  member: ITodolistMember;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  statusId?: number;

  @ApiProperty()
  statusIndex?: number;

  @ApiProperty()
  resetIndexStatus?: boolean;

  @ApiProperty()
  resetIndexTask?: boolean;
}

export class SeedListTaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  wordCount: number;
}

export class SeedListDocDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ default: 10 })
  quantityParentDoc: number;

  @ApiProperty({ default: 5 })
  docNameLength: number;

  @ApiProperty({ default: 20 })
  docContentLength: number;
}
