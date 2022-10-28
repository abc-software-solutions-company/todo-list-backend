import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  todoListId: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

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
