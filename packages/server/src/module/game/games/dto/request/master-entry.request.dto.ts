import { MasterEntryRequest } from '@shared/interfaces/request/master-entry.request.interface';
import { IsNumber } from 'class-validator';

export class MasterEntryRequestDto implements MasterEntryRequest {
  @IsNumber()
  classId: number;
}
