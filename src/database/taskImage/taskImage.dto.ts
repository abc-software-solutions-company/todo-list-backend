import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskImageDto {
  @ApiProperty()
  taskId: string;

  @ApiProperty()
  imageId: number;
}

export class UpdateTaskImageDto extends CreateTaskImageDto {
  @ApiProperty()
  isActive: boolean;
}
