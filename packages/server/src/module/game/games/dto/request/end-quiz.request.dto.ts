import { EndQuizRequest } from '@shared/interfaces/request/end-quiz.request.interface';
import { IsString } from 'class-validator';

export class EndQuizRequestDto implements EndQuizRequest {
  @IsString()
  sid: string;

  @IsString()
  pinCode: string;
}
