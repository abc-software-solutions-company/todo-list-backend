import { ApiProperty } from '@nestjs/swagger';
import { IAssignee, IAttachment, IComment } from './index.type';
import { TaskTypeEnum, priorities } from 'src/utils/constants';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: String,
    example: TaskTypeEnum.TASK,
  })
  @IsOptional()
  type: TaskTypeEnum;

  @ApiProperty({
    example: '741w1',
  })
  todolistId: string;

  @ApiProperty()
  statusId: number;
}

export class UpdateTaskDto {
  @ApiProperty({
    example: '6c0aa128-1958-47bc-b06b-b20ddfc83354',
  })
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

  @ApiProperty({
    example: priorities.medium,
  })
  priority: string;

  @ApiProperty({
    example: ['5553a2e8-183e-489c-8c30-196fc293c3e0', '6543400f-b694-4b5d-920b-8c066c529885'],
  })
  @IsArray()
  @IsOptional()
  relatedIds?: string[];

  @ApiProperty()
  assignee: IAssignee;

  @ApiProperty({
    type: String,
    example: TaskTypeEnum.TASK,
  })
  type: TaskTypeEnum;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isFeature: boolean;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  indexColumn: number;
}

export class FindOrtherTasksDto {
  @ApiProperty({
    example: '7712890e-5ee9-47cc-9de3-d937722be465',
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    example: '741w1',
  })
  @IsString()
  todolistId: string;
}

export class ReindexAllDto {
  @ApiProperty({ example: 'taskFirstId' })
  todolistId: string;
}
