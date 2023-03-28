import { ApiProperty } from '@nestjs/swagger';
import { StringDecoder } from 'string_decoder';
import { ITodolistMember } from './index.type';

export class CreateTodolistDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  taskSymbol: string;
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
  taskSymBol: string;

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
