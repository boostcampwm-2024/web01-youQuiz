import { EmojiRequest } from '@shared/interfaces/request/emoji.request.interface';
import { IsNumber, IsString } from 'class-validator';

export class EmojiRequestDto implements EmojiRequest {
  @IsString()
  pinCode: number;

  @IsNumber()
  currentOrder: number;
}
