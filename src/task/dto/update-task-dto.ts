import {IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task name must not be exceed 100 character',
    maxLength: 100
  })
  @MaxLength(100, {
    message: 'Task name must not be exceed 100 character'
  })
  @IsString()
  name: string;
}
