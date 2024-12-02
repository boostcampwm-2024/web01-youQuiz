import { Expose } from 'class-transformer';
import { NicknameEventDataResponseDto } from './nicknameEventData.response.dto';
import { MyPositionDataResponseDto } from './myPositionData.response.dto';

export class ParticipantEntryResponseDto {
  @Expose()
  nicknameEventData: NicknameEventDataResponseDto;

  @Expose()
  myPositionData: MyPositionDataResponseDto;

  constructor(
    nicknameEventData: NicknameEventDataResponseDto,
    myPositionData: MyPositionDataResponseDto,
  ) {
    this.nicknameEventData = nicknameEventData;
    this.myPositionData = myPositionData;
  }
}
