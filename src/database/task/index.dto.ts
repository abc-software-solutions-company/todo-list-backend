import { ApiProperty } from '@nestjs/swagger';
import { IAttachments, IComments } from './index.type';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  todolistId: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  attachments: IAttachments;

  @ApiProperty()
  comments: IComments;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  statusId: number;
}

export class ReIndexDto {
  @ApiProperty({ example: 'taskFirstId' })
  taskFirstId: string;

  @ApiProperty({ example: 'taskSecondId' })
  taskSecondId: string;

  @ApiProperty({ example: 'taskReorderId' })
  taskReorderId: string;
}