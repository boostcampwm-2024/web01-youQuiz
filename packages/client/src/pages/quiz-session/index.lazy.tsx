import { useParams } from 'react-router-dom';

import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import { useQuizSession } from './model/hooks/useQuizSession';
import { usePersistState } from '@/shared/hooks/usePersistState';
import { getQuizSocket } from '@/shared/utils/socket';
import { useEffect, useState } from 'react';
import { clearLocalStorage } from '@/shared/utils/clearLocalStorage';
import { GUEST_LOCAL_STORAGE_KEYS } from '@/shared/constants/guestLocalStorageKey';

export default function QuizSessionLazyPage() {
  const socket = getQuizSocket();
  const { pinCode, id } = useParams();
  const [isQuizEnd, setIsQuizEnd] = usePersistState('isQuizEnd', false);
  const [initializeStates, setInitializeStates] = useState(false);
  const { data: quiz, refetch } = useQuizSession({
    socket,
    pinCode: pinCode as string,
    quizOrder: parseInt(id as string),
  });

  useEffect(() => {
    const prevCurrentOrder = localStorage.getItem('currentOrder');
    if (prevCurrentOrder !== null && parseInt(prevCurrentOrder) !== quiz.currentQuizData.position) {
      clearLocalStorage(GUEST_LOCAL_STORAGE_KEYS);
      setIsQuizEnd(false);
      setInitializeStates(true);
    }
    const handleBeforeUnload = () => {
      localStorage.setItem('currentOrder', JSON.stringify(quiz.currentQuizData.position));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quiz.currentQuizData.position]);

  return (
    <>
      {!isQuizEnd && (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="relative w-full">
            <QuizHeader
              startTime={quiz.startTime}
              timeLimit={quiz.currentQuizData.timeLimit}
              setQuizEnd={setIsQuizEnd}
              totalParticipants={quiz.participantLength}
              pinCode={pinCode as string}
            />
            <QuizBox
              quiz={quiz.currentQuizData}
              startTime={quiz.startTime}
              quizMaxNum={quiz.quizMaxNum}
              initializeStates={initializeStates}
              setInitializeStates={setInitializeStates}
            />
          </div>
        </div>
      )}
      {isQuizEnd && (
        <QuizEnd
          quizOrder={quiz.currentQuizData.position}
          refetch={refetch}
          setQuizEnd={setIsQuizEnd}
        />
      )}
    </>
  );
}
