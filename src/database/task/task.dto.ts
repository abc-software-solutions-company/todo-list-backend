import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  todoListId: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  isActive: boolean;
}
export class ReIndexDto {
  @ApiProperty({ example: 'taskFirstID' })
  taskFirstID: string;

  @ApiProperty({ example: 'taskSecondId' })
  taskSecondID: string;

  @ApiProperty({ example: 'taskReorderId' })
  taskReorderID: string;
}
