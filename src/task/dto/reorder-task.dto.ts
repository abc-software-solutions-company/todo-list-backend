import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ReorderTaskDTO {
  @ApiProperty({example:"e88a4c01-7762-47cf-a913-0dc9754f7538"})
  @IsString()
  taskFirstID: string;

  @ApiProperty({example:"c952c9bc-3f33-46b8-a877-7f39f0690948"})
  @IsString()
  taskSecondID: string;
}
