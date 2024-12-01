import { ShowQuizRequest } from '@shared/interfaces/request/show-quiz.request.interface';
import { IsString } from 'class-validator';

export class ShowQuizRequestDto implements ShowQuizRequest {
  @IsString()
  pinCode: string;
}
