import { useSuspenseQuery } from '@tanstack/react-query';

import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';
import { Socket } from 'socket.io-client';
import { Guest } from '../../index.lazy';

interface NicknameResponse {
  participantList: Guest[];
  myPosition: number;
}

export const useNickname = (socket: Socket, pinCode: string, sid: string) => {
  return useSuspenseQuery({
    queryKey: ['participant info', pinCode],
    queryFn: () => emitEventWithAck<NicknameResponse>(socket, 'participant info', { pinCode, sid }),
  });
};
