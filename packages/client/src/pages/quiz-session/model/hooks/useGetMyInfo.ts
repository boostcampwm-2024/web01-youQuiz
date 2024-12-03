import { getCookie } from '@/shared/utils/cookie';
import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';

interface UseGetMyInfoProps {
  socket: Socket;
}

export const useGetMyInfo = ({ socket }: UseGetMyInfoProps) => {
  return useSuspenseQuery({
    queryKey: ['myInfo'],
    queryFn: () => {
      return emitEventWithAck<any>(socket, 'my info', { sid: getCookie('sid') });
    },
  });
};
