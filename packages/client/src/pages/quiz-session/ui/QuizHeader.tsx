import { useEffect, useState } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
import { usePersistState } from '@/shared/hooks/usePersistState';

interface QuizHeaderProps {
  startTime: number;
  timeLimit: number;
  setQuizEnd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuizHeader({ startTime, timeLimit, setQuizEnd }: QuizHeaderProps) {
  const socket = getQuizSocket();
  const [submitStatus, setSubmitStatus] = useState<any>({
    count: 0,
    total: 0,
  });
  const [remainingTime, setRemainingTime] = usePersistState('ramainingTime', timeLimit);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = timeLimit - Math.floor((Date.now() - startTime) / 1000);
      setRemainingTime(timeLeft);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, timeLimit]);

  useEffect(() => {
    if (remainingTime === 0) {
      setQuizEnd(true);
    }
  }, [remainingTime]);

  return (
    <div className="relative z-10 p-6 max-w-4xl mx-auto pt-8 ">
      <div className="flex justify-between items-center bg-white backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <div className="text-lg text-gray-500 font-medium">서두르세요!</div>
        <div className="text-bold-lg">{remainingTime}초 남음</div>
      </div>
    </div>
  );
}
