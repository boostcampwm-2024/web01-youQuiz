import { useState, useEffect } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
import QuizBackground from './ui/QuizBackground';
import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import QuizLoading from './ui/QuizLoading';
import { toastController } from '@/features/toast/model/toastController';

export default function QuizSession() {
  const socket = getQuizSocket();
  const toast = toastController();
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [tick, setTick] = useState({ currentTime: 0, elapsedTime: 0, remainingTime: 0 });
  const [quiz, setQuiz] = useState<QuizData>({
    id: '',
    content: '',
    choices: [],
  });

  const handleTick = (response: any) => {
    setTick(response);
  };

  const handleTimeEnd = () => {
    setIsQuizEnd(true);
  };

  useEffect(() => {
    const quizPromise = new Promise((resolve, reject) => {
      const handleShowQuiz = (response: any) => {
        const { currentQuizData, isLast } = response;
        setQuiz(currentQuizData);
        setIsLoading(true);
        setIsQuizEnd(false);
        resolve(currentQuizData);
      };
      socket.on('show quiz', handleShowQuiz);

      const timer = setTimeout(() => {
        reject(new Error('Timeout'));
      }, 2000);

      return () => {
        socket.off('show quiz', handleShowQuiz);
        clearTimeout(timer);
      };
    });

    const timerPromise = new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    Promise.all([quizPromise, timerPromise])
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('문제 로딩에 실패했습니다.');
        setIsLoading(false);
      });

    socket.on('timer tick', handleTick);
    socket.on('time end', handleTimeEnd);

    return () => {
      socket.off('time end', handleTimeEnd);
      socket.off('timer tick', handleTick);
    };
  }, []);

  return (
    <>
      {isLoading && !isQuizEnd && <QuizLoading />}
      {!isLoading && !isQuizEnd && (
        <div className="relative w-full">
          <QuizHeader tick={tick} />
          <QuizBox quiz={quiz} tick={tick} />
        </div>
      )}
      {isQuizEnd && <QuizEnd />}
    </>
  );
}
