import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCookie } from '@/shared/utils/cookie';
import { getQuizSocket } from '@/shared/utils/socket';

import { useQuizSession } from '../quiz-session/model/hooks/useQuizSession';
import QuizMasterHeader from './ui/QuizMasterHeader';
import Statistics from './ui/Statistics';
import { clearLocalStorage } from '@/shared/utils/clearLocalStorage';

const LOCAL_STORAGE_KEYS = ['masterStatistics', 'reactionStats', 'history', 'remainingTime'];

export default function QuizMasterSessionLazyPage() {
  const { pinCode, id } = useParams();
  const navigate = useNavigate();
  const socket = getQuizSocket();
  const [initializeStates, setInitializeStates] = useState(false);

  const { data: quiz, refetch } = useQuizSession({ socket, pinCode: pinCode as string });

  const handleNextQuiz = () => {
    if (quiz.isLast) {
      socket.emit('end quiz', { pinCode, sid: getCookie('sid') });
      clearLocalStorage(LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/${pinCode}/end`);
      return;
    }

    socket.emitWithAck('start quiz', { pinCode, sid: getCookie('sid') }).then(() => {
      clearLocalStorage(LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/host/${pinCode}/${parseInt(id as string) + 1}`);
      refetch();
      setInitializeStates(true);
    });
  };

  return (
    <div className="w-screen min-h-screen">
      <QuizMasterHeader
        quizData={quiz.currentQuizData}
        startTime={quiz.startTime}
        timeLimit={quiz.currentQuizData.timeLimit}
        handleNextQuiz={handleNextQuiz}
        pinCode={pinCode as string}
        socket={socket}
      />
      <Statistics
        quizData={quiz.currentQuizData}
        initializeStates={initializeStates}
        setInitializeStates={setInitializeStates}
      />
    </div>
  );
}
