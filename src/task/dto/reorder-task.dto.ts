import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ReorderTaskDTO {
  @ApiProperty({example:"b0e035db-1532-4f73-90c1-ce5d0f8d03a8"})
  @IsString()
  taskFirstID: string;

  @ApiProperty({example:"622f034a-6533-4d4e-8153-488e919b77b8"})
  @IsString()
  taskSecondID: string;

  @ApiProperty({example:"f8998fd2-e24b-4b77-9e8f-6320e0f30bf6"})
  @IsString()
  taskReorderID: string;
}
