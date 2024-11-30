import { LeaderboardRequest } from '@shared/interfaces/request/leaderboard.request.interface';
import { IsString } from 'class-validator';

export class LeaderboardRequestDto implements LeaderboardRequest {
  @IsString()
  pinCode: string;
}
