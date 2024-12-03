import { useParams } from 'react-router-dom';

import QuizBox from './ui/QuizBox';
import QuizEnd from './ui/QuizEnd';
import QuizHeader from './ui/QuizHeader';
import { useQuizSession } from './model/hooks/useQuizSession';
import { usePersistState } from '@/shared/hooks/usePersistState';
import { getQuizSocket } from '@/shared/utils/socket';

export default function QuizSessionLazyPage() {
  const socket = getQuizSocket();
  const { pinCode } = useParams();
  const [isQuizEnd, setIsQuizEnd] = usePersistState('isQuizEnd', false);
  const { data: quiz, refetch } = useQuizSession({ socket, pinCode: pinCode as string });
  return (
    <>
      {!isQuizEnd && (
        <div className="relative w-full">
          <QuizHeader
            startTime={quiz.startTime}
            timeLimit={quiz.currentQuizData.timeLimit}
            setQuizEnd={setIsQuizEnd}
            totalParticipants={quiz.participantLength}
          />
          <QuizBox
            quiz={quiz.currentQuizData}
            startTime={quiz.startTime}
            quizMaxNum={quiz.quizMaxNum}
          />
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
