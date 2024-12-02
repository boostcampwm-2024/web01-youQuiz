import { Expose } from 'class-transformer';

export class ParticipantStatisticsResponseDto {
  @Expose()
  totalSubmit: number;

  @Expose()
  solveRate: number;

  @Expose()
  averageTime: number;

  @Expose()
  participantRate: number;

  constructor(total: number, solveRate: number, averageTime: number, participantRate: number) {
    this.totalSubmit = total;
    this.solveRate = solveRate;
    this.averageTime = averageTime;
    this.participantRate = participantRate;
  }
}
