import { EmojiRequest } from '@shared/interfaces/request/emoji.request.interface';
import { IsNumber, IsString } from 'class-validator';
import { EmojiType } from '@shared/types/emoji.types';

export class EmojiRequestDto implements EmojiRequest {
  @IsString()
  pinCode: string;

  @IsNumber()
  currentOrder: number;

  @IsString()
  emoji: EmojiType;
}
