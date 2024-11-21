import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import QuizBackground from './ui/QuizBackground';
import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import QuizLoading from './ui/QuizLoading';
import { toastController } from '@/features/toast/model/toastController';

export default function QuizSession() {
  const { pinCode } = useParams();
  const socket = getQuizSocket();
  const toast = toastController();
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [reactionStats, setReactionStats] = useState({
    easy: 0,
    hard: 0,
  });
  const [quiz, setQuiz] = useState<QuizData>({
    id: '',
    content: '',
    choices: [],
  });

  const totalReactions = reactionStats.easy + reactionStats.hard;
  const easyPercentage = totalReactions ? (reactionStats.easy / totalReactions) * 100 : 50;

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

    socket.on('timer end', () => {
      setIsQuizEnd(true);
    });

    return () => {
      socket.off('timer end', () => {});
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <QuizLoading />
      ) : (
        <div>
          <QuizHeader />
          <QuizBackground easyPercentage={easyPercentage} />
          <QuizBox reactionStats={reactionStats} setReactionStats={setReactionStats} quiz={quiz} />
        </div>
      )}
      {isQuizEnd && <QuizEnd />}
    </>
  );
}
