import {IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task name must not be exceed 25 character',
    maxLength: 25
  })
  @MaxLength(25, {
    message: 'Task name must not be exceed 25 character'
  })
  @IsString()
  taskName: string;
}
