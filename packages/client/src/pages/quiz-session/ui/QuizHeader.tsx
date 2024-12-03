import { useEffect } from 'react';

import { usePersistState } from '@/shared/hooks/usePersistState';
import { getQuizSocket } from '@/shared/utils/socket';

interface QuizHeaderProps {
  startTime: number;
  timeLimit: number;
  setQuizEnd: React.Dispatch<React.SetStateAction<boolean>>;
  totalParticipants: number;
}

export default function QuizHeader({
  startTime,
  timeLimit,
  setQuizEnd,
  totalParticipants,
}: QuizHeaderProps) {
  const [remainingTime, setRemainingTime] = usePersistState('ramainingTime', timeLimit);
  const [participantStatistics, setParticipantStatistics] = usePersistState(
    'participantStatistics',
    {
      totalSubmit: 0,
    },
  );
  const socket = getQuizSocket();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = timeLimit - Math.floor((Date.now() - startTime) / 1000);
      setRemainingTime(timeLeft);
    }, 1000);
    socket.on('participant statistics', (response) => {
      setParticipantStatistics(response);
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, timeLimit]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setQuizEnd(true);
    }
  }, [remainingTime]);

  return (
    <div className="relative z-10 p-6 max-w-4xl mx-auto pt-8 ">
      <div className="flex justify-between items-center bg-white backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <div className="text-lg text-gray-500 font-medium">
          <div className="text-bold-lg">
            {participantStatistics.totalSubmit || 0}/{totalParticipants}명 제출
          </div>
        </div>
        <div className="text-bold-lg">{remainingTime}초 남음</div>
      </div>
    </div>
  );
}
