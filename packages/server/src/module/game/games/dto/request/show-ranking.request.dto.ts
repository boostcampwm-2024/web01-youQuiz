import { ShowRankingRequest } from '@shared/interfaces/request/show-ranking.interface';
import { IsString } from 'class-validator';

export class ShowRankingRequestDto implements ShowRankingRequest {
  @IsString()
  pinCode: string;

  @IsString()
  sid: string;
}
