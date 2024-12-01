import { SubmitAnswerRequest } from '@shared/interfaces/request/submit-answer.request.interface';
import { IsNumber, IsString } from 'class-validator';

export class SubmitAnswerRequestDto implements SubmitAnswerRequest {
  @IsString()
  pinCode: string;

  @IsString()
  sid: string;

  @IsNumber({}, { each: true })
  selectedAnswer: number[];

  @IsNumber()
  submitTime: number;
}
