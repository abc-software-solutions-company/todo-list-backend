import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PoolDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  num: number;
}
