import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskAttachmentDto {
  @ApiProperty()
  taskId: string;

  @ApiProperty()
  attachmentId: number;
}

export class UpdateTaskAttachmentDto extends CreateTaskAttachmentDto {
  @ApiProperty()
  isActive: boolean;
}
