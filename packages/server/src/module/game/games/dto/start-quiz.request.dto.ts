import { StartQuizRequest } from '@shared/interfaces/request/start-quiz.request.interface';
import { IsString } from 'class-validator';

export class StartQuizRequestDto implements StartQuizRequest {
  @IsString()
  sid: string;

  @IsString()
  pinCode: string;
}
