import { getCookie } from '@/shared/utils/cookie';
import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';

interface UseShowRankingProps {
  socket: Socket;
  pinCode: string;
}

export const useShowRanking = ({ socket, pinCode }: UseShowRankingProps) => {
  return useSuspenseQuery({
    queryKey: ['showRanking', pinCode],
    queryFn: () => {
      return emitEventWithAck<any>(socket, 'show ranking', { pinCode, sid: getCookie('sid') });
    },
  });
};
