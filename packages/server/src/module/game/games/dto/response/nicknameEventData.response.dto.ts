import { Expose } from 'class-transformer';
import { ParticipantInfo } from '../../interfaces/participantInfo.interface';

export class NicknameEventDataResponseDto {
  @Expose()
  participantList: ParticipantInfo[];

  constructor(participantList: ParticipantInfo[]) {
    this.participantList = participantList;
  }
}
