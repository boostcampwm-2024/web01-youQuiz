import { Expose } from 'class-transformer';

export class ShowRankingResponseDto {
  @Expose()
  rankerData: { nickname: any; score: string }[];

  @Expose()
  myRank: number;

  @Expose()
  myScore: string;

  @Expose()
  myNickname: string;

  constructor(
    rankerData: { nickname: string; score: string }[],
    myRank: number,
    myScore: string,
    myNickname: string,
  ) {
    this.rankerData = rankerData;
    this.myRank = myRank;
    this.myScore = myScore;
    this.myNickname = myNickname;
  }
}
