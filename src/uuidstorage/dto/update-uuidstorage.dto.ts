import { PartialType } from '@nestjs/swagger';
import { CreateUuidstorageDto } from './create-uuidstorage.dto';

export class UpdateUuidstorageDto extends PartialType(CreateUuidstorageDto) {}
