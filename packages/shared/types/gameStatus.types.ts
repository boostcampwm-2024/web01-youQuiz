export const GAMESTATUS_TYPES = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN PROGRESS',
  RANKING: 'RANKING',
  LEADERBORAD: 'LEADERBORAD',
  END: 'END',
} as const;

export type GameStatusType = (typeof GAMESTATUS_TYPES)[keyof typeof GAMESTATUS_TYPES];
