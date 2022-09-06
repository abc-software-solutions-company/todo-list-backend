import {IsString, IsUUID, IsNumber, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task name must not be exceed 100 character',
    maxLength: 100
  })
  @MaxLength(100, {
    message: 'Task name must not be exceed 100 character'
  })
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNumber()
  todoListId: number;
}
