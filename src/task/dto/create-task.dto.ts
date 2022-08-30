import {IsString, IsUUID, IsNumber, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task name must not be exceed 25 character',
    maxLength: 25
  })
  @MaxLength(25, {
    message: 'Task name must not be exceed 25 character'
  })
  @IsString()
  taskName: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNumber()
  todolistId: number;
}
