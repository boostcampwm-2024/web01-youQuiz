import { Expose } from 'class-transformer';
import { ParticipantInfo } from '../../interfaces/participantInfo.interface';

export class MyPositionDataResponseDto {
  @Expose()
  participantList: ParticipantInfo[];

  @Expose()
  myPosition: number;

  constructor(participantList: ParticipantInfo[], myPosition: number) {
    this.participantList = participantList;
    this.myPosition = myPosition;
  }
}
