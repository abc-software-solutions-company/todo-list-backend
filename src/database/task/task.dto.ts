import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @MinLength(1)
  @IsString()
  name: string;

  userId: string;

  @ApiProperty()
  @IsString()
  todoListId: string;
}
export class ReorderTaskDto {
  @ApiProperty({ example: 'taskFirstID' })
  taskFirstID: string;

  @ApiProperty({ example: '622f034a-6533-4d4e-8153-488e919b77b8' })
  @IsNotEmpty()
  taskSecondID: string;

  @ApiProperty({ example: 'f8998fd2-e24b-4b77-9e8f-6320e0f30bf6' })
  taskReorderID: string;
}
export class TaskDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  createdDate: Date;
}
export class UpdateTaskDto {
  @ApiProperty()
  @MinLength(1)
  @IsString()
  name: string;
}
