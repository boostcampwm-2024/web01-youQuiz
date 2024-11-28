export const CONNECTION_TYPES = {
  ON: 'ON',
  OFF: 'OFF',
} as const;

export type ConnectionType = (typeof CONNECTION_TYPES)[keyof typeof CONNECTION_TYPES];
