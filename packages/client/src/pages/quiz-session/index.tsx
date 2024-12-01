import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import QuizLoading from './ui/QuizLoading';
// import { toastController } from '@/features/toast/model/toastController';
import { QuizData } from '@youquiz/shared/interfaces/utils/quizdata.interface';
import { ShowQuizResponse, TimerTickResponse } from '@youquiz/shared/interfaces/response';
import { INITIAL_QUIZ_DATA, INITIAL_TICK } from '@/shared/constants/initialState';

export default function QuizSession() {
  const socket = getQuizSocket();
  // const toast = toastController();
  const navigate = useNavigate();
  const { pinCode } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [tick, setTick] = useState<TimerTickResponse>(INITIAL_TICK);
  const [quiz, setQuiz] = useState<QuizData>(INITIAL_QUIZ_DATA);

  useEffect(() => {
    const quizPromise = new Promise((resolve, reject) => {
      const handleShowQuiz = (response: ShowQuizResponse) => {
        const { currentQuizData } = response;
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
        // toast.error('문제 로딩에 실패했습니다.');
        setIsLoading(false);
      });

    const handleTick = (response: TimerTickResponse) => {
      setTick(response);
    };

    const handleTimeEnd = () => {
      setIsQuizEnd(true);
    };

    const handleQuizEnd = () => {
      navigate(`/quiz/session/${pinCode}/end`);
    };

    socket.on('end quiz', handleQuizEnd);
    socket.on('timer tick', handleTick);
    socket.on('time end', handleTimeEnd);

    return () => {
      socket.off('timer tick', handleTick);
      socket.off('time end', handleTimeEnd);
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
