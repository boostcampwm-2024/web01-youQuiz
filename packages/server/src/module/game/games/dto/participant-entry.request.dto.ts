import { ParticipantEntryRequest } from '@shared/interfaces/request/participant-entry.request.interface';
import { IsString } from 'class-validator';

export class ParticipantEntryRequestDto implements ParticipantEntryRequest {
  @IsString()
  pinCode: string;

  @IsString()
  nickname: string;
}
