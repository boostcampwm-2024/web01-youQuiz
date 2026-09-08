import { useSuspenseQuery } from '@tanstack/react-query';
import { emitEventWithAck } from '@/shared/utils/emitEventWithAck';
import { Socket } from 'socket.io-client';

interface UseQuizSessionProps {
  socket: Socket;
  pinCode: string;
  quizOrder: number;
}

interface ShowQuizResponse {
  quizMaxNum: number;
  currentQuizData: QuizData;
  isLast: boolean;
  startTime: number;
  participantLength: number;
}

export const getQuizSessionQueryOptions = ({
  socket,
  pinCode,
  quizOrder,
}: UseQuizSessionProps) => ({
  queryKey: ['show quiz', pinCode, quizOrder],
  queryFn: () => emitEventWithAck<ShowQuizResponse>(socket, 'show quiz', { pinCode }),
});

export const useQuizSession = (props: UseQuizSessionProps) => {
  return useSuspenseQuery(getQuizSessionQueryOptions(props));
};
