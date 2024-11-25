import { useState, useEffect } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import QuizLoading from './ui/QuizLoading';
import { toastController } from '@/features/toast/model/toastController';

const INITIAL_QUIZ_DATA: QuizData = {
  id: 0,
  content: '',
  quizType: '',
  timeLimit: 0,
  point: 0,
  position: 0,
  choices: [],
};

export default function QuizSession() {
  const socket = getQuizSocket();
  const toast = toastController();
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [tick, setTick] = useState({ currentTime: 0, elapsedTime: 0, remainingTime: 0 });
  const [quiz, setQuiz] = useState<QuizData>(INITIAL_QUIZ_DATA);

  const handleTick = (response: any) => {
    setTick(response);
  };

  const handleTimeEnd = () => {
    setIsQuizEnd(true);
  };

  useEffect(() => {
    const quizPromise = new Promise((resolve, reject) => {
      const handleShowQuiz = (response: any) => {
        const { currentQuizData } = response;
        setQuiz(currentQuizData);
        setIsLoading(true);
        setIsQuizEnd(false);
        console.log('ON SHOW QUIZ', currentQuizData);
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
      const timer = setTimeout(resolve, 2000);

      return () => {
        clearTimeout(timer);
      };
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
  }, [quiz]);

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
