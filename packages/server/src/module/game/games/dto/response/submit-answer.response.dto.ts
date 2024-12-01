import { Expose } from 'class-transformer';
import { ParticipantStatisticsResponseDto } from './participantStatistics.response.dto';
import { MasterStatisticsResponseDto } from './masterStatistics.response.dto';

export class SubmitAnswerResponseDto {
  @Expose()
  participantStatistics: ParticipantStatisticsResponseDto;

  @Expose()
  masterStatistics: MasterStatisticsResponseDto;

  @Expose()
  submitOrder: number;

  constructor(
    participantStatistics: ParticipantStatisticsResponseDto,
    masterStatistics: MasterStatisticsResponseDto,
    totalSubmit: number,
  ) {
    this.participantStatistics = participantStatistics;
    this.masterStatistics = masterStatistics;
    this.submitOrder = totalSubmit;
  }
}
