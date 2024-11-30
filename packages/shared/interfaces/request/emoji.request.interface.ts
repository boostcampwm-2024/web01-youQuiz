import { EmojiType } from '../../types/emoji.types';

export interface EmojiRequest {
  pinCode: string;
  currentOrder: number;
  emoji: EmojiType;
}
