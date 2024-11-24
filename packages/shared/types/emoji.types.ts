export const EMOJI_TYPES = {
  EASY: 'easy',
  HARD: 'hard',
} as const;

export type EmojiType = (typeof EMOJI_TYPES)[keyof typeof EMOJI_TYPES];
