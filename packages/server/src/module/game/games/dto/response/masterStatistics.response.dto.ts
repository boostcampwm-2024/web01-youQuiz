import { Expose } from 'class-transformer';

export class MasterStatisticsResponseDto {
  @Expose()
  totalSubmit: number;

  @Expose()
  solveRate: number;

  @Expose()
  averageTime: number;

  @Expose()
  participantRate: number;

  @Expose()
  choiceStatus: Record<number, number>;

  @Expose()
  submitHistory: [string, number][];

  @Expose()
  participantLength: number;

  constructor(
    total: number,
    solveRate: number,
    averageTime: number,
    participantRate: number,
    choiceStatus: Record<number, number>,
    submitHistory: [string, number][],
    participantLength: number,
  ) {
    this.totalSubmit = total;
    this.solveRate = solveRate;
    this.averageTime = averageTime;
    this.participantRate = participantRate;
    this.choiceStatus = choiceStatus;
    this.submitHistory = submitHistory;
    this.participantLength = participantLength;
  }
}
