import { useEffect, useState } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';

interface QuizHeaderProps {
  tick: { currentTime: number; elapsedTime: number; remainingTime: number };
}

export default function QuizHeader({ tick }: QuizHeaderProps) {
  const socket = getQuizSocket();
  const [submitStatus, setSubmitStatus] = useState<{ count: number; total: number }>({
    count: 0,
    total: 0,
  });

  const handleSubmitStatus = (status: { count: number; total: number }) => {
    setSubmitStatus(status);
  };

  useEffect(() => {
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
        <div className="text-bold-lg">{tick.remainingTime}초 남음</div>
      </div>
    </div>
  );
}
