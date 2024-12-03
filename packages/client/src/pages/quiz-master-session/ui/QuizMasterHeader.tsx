import { usePersistState } from '@/shared/hooks/usePersistState';
import { useEffect } from 'react';

import { Socket } from 'socket.io-client';

interface QuizMasterHeaderProps {
  quizData: QuizData;
  startTime: number;
  timeLimit: number;
  handleNextQuiz: () => void;
  pinCode: string;
  socket: Socket;
}

export default function QuizMasterHeader({
  quizData,
  startTime,
  timeLimit,
  handleNextQuiz,
  pinCode,
  socket,
}: QuizMasterHeaderProps) {
  const [remainingTime, setRemainingTime] = usePersistState('remainingTime', timeLimit);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = timeLimit - Math.floor((Date.now() - startTime) / 1000);
      setRemainingTime(timeLeft);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      socket.emit('time end', { pinCode: pinCode });
    }
  }, [remainingTime]);

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold mb-2">실시간 통계</h1>
          <p className="text-2xl font-bold mb-2">
            Q{quizData.position + 1}. {quizData.content}
          </p>
        </div>
        <div>
          <p className="font-bold text-gray-500 mb-2">
            제한 시간 {remainingTime <= 0 ? '종료' : remainingTime}
          </p>
          <div className="mb-2">
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50`}
              onClick={handleNextQuiz}
              disabled={remainingTime > 0}
            >
              다음 퀴즈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
