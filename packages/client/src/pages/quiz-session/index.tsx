import { useState, useEffect } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
import QuizBackground from './ui/QuizBackground';
import QuizBox from './ui/QuizBox';
import QuizHeader from './ui/QuizHeader';
import QuizLoading from './ui/QuizLoading';
import { toastController } from '@/features/toast/model/toastController';

export default function QuizSession() {
  const socket = getQuizSocket();
  const toast = toastController();
  const [isLoading, setIsLoading] = useState(true);
  const [reactionStats, setReactionStats] = useState({
    easy: 0,
    hard: 0,
  });
  const [quiz, setQuiz] = useState(null);

  const totalReactions = reactionStats.easy + reactionStats.hard;
  const easyPercentage = totalReactions ? (reactionStats.easy / totalReactions) * 100 : 50;

  useEffect(() => {
    const quizPromise = new Promise((resolve, reject) => {
      const handleShowQuiz = (data: any) => {
        setQuiz(data);
        resolve(data);
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

    socket.emit('timeout', (response: any) => {
      console.log(response);
    });
  }, []);

  console.log(quiz);
  return (
    <>
      {isLoading ? (
        <QuizLoading />
      ) : (
        <div>
          <QuizHeader />
          <QuizBackground easyPercentage={easyPercentage} />
          <QuizBox reactionStats={reactionStats} setReactionStats={setReactionStats} />
        </div>
      )}
    </>
  );
}
