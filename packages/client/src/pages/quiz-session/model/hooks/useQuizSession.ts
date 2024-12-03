import { useSuspenseQuery } from '@tanstack/react-query';
import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';
import { Socket } from 'socket.io-client';

interface UseQuizSessionProps {
  socket: Socket;
  pinCode: string;
}

interface ShowQuizResponse {
  quizMaxNum: number;
  currentQuizData: QuizData;
  isLast: boolean;
  startTime: number;
  participantLength: number;
}

export const useQuizSession = ({ socket, pinCode }: UseQuizSessionProps) => {
  return useSuspenseQuery({
    queryKey: ['show quiz', pinCode],
    queryFn: () => emitEventWithAck<ShowQuizResponse>(socket, 'show quiz', { pinCode }),
  });
};
