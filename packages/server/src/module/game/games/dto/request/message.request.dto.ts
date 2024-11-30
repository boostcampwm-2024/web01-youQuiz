import { MessageRequest } from '@shared/interfaces/request/message.request.interface';
import { IsNumber, IsString } from 'class-validator';

export class MessageRequestDto implements MessageRequest {
  @IsString()
  pinCode: string;

  @IsString()
  message: string;

  @IsNumber()
  position: number;
}
