import {IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task name must not be exceed 100 character',
    maxLength: 100
  })
  @MaxLength(100, {
    message: 'Task name must not be exceed 100 character'
  })
  @MinLength(1)
  @IsString()
  name: string;

  userId: string;

  @ApiProperty()
  @IsString()
  todoListId: string;
}
