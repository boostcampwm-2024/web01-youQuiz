export const QUIZ_TYPES = {
  MULTIPLE_CHOICE: 'MC',
  TRUE_FALSE: 'TF',
} as const;

export type QuizType = (typeof QUIZ_TYPES)[keyof typeof QUIZ_TYPES];
