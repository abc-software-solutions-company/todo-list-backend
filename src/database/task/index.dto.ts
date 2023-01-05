import { ApiProperty } from '@nestjs/swagger';
import { IAssignee, IAttachment, IComment } from './index.type';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  todolistId: string;

  @ApiProperty()
  statusId: number;
}

export class UpdateTaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  index: number;

  @ApiProperty()
  storyPoint: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty()
  attachment: IAttachment;

  @ApiProperty()
  comment: IComment;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  assignee: IAssignee;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  statusId: number;
}

export class ReindexAllDto {
  @ApiProperty({ example: 'taskFirstId' })
  todolistId: string;
}
