import { ApiProperty } from '@nestjs/swagger';
import { ITodolistMember } from './index.type';

export class CreateTodolistDto {
  @ApiProperty()
  name: string;
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
  visibility: string;

  @ApiProperty()
  member: ITodolistMember;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  statusId?: number;

  @ApiProperty()
  statusIndex?: number;
}
