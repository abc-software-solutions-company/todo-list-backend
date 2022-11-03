import { ApiProperty } from '@nestjs/swagger';

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
  attachments: {
    add: { name: string; link: string };
    remove: { id: number };
    edit: { id: number; name: string };
  };

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
