import { useQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';

import { Ranking } from '../..';
import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';

interface LeaderboardData {
  rankerData: Ranking[];
  participantNumber: number;
  averageScore: number;
}

export const useLeaderboard = (socket: Socket, pinCode: string) => {
  return useQuery({
    queryKey: ['leaderboard', pinCode],
    queryFn: () => emitEventWithAck<LeaderboardData>(socket, 'leaderboard', { pinCode }),
  });
};
