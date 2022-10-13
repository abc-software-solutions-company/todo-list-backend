import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  todoListId: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty({ example: '622f034a-6533-4d4e-8153-488e919b77b8' })
  @IsNotEmpty()
  taskSecondID: string;

  @ApiProperty({ example: 'f8998fd2-e24b-4b77-9e8f-6320e0f30bf6' })
  taskReorderID: string;
}
