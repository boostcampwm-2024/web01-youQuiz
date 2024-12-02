import { Expose } from 'class-transformer';
import { EmojiType } from '@shared/types/emoji.types';

export class EmojiResponseDto {
  @Expose()
  emojiStatus: EmojiType;

  constructor(emojiStatus: EmojiType) {
    this.emojiStatus = emojiStatus;
  }
}
