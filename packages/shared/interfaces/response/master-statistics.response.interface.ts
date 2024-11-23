export interface MasterStatisticsResponse {
  totalSubmit: number;
  solveRate: number;
  averageTime: number;
  participantRate: number;
  choiceStatus: { [key: number]: number };
  submitHistory: [string, number][];
}
