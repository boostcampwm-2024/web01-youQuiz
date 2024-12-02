import { useEffect, useState } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';

interface QuizHeaderProps {
  startTime: number;
  timeLimit: number;
  setQuizEnd: (value: boolean) => void;
}

export default function QuizHeader({ startTime, timeLimit, setQuizEnd }: QuizHeaderProps) {
  const socket = getQuizSocket();
  const [submitStatus, setSubmitStatus] = useState<any>({
    count: 0,
    total: 0,
  });
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = timeLimit - Math.floor((Date.now() - startTime) / 1000);
      setRemainingTime(timeLeft);
      if (timeLeft <= 0) {
        setQuizEnd(true);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, timeLimit]);

  useEffect(() => {
    const handleSubmitStatus = (status: any) => {
      console.log('submitStatus', status);
      setSubmitStatus(status);
    };

    socket.on('submit status', handleSubmitStatus);

    return () => {
      socket.off('submit status', handleSubmitStatus);
    };
  }, []);

  return (
    <div className="relative z-10 p-6 max-w-4xl mx-auto pt-8 ">
      <div className="flex justify-between items-center bg-white backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <div className="text-lg text-black-400 font-semibold">
          {submitStatus.count} / {submitStatus.total}명 제출
        </div>
        <div className="text-bold-lg">{remainingTime}초 남음</div>
      </div>
    </div>
  );
}
