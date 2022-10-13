import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PoolDto {
  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  num: number;
}
