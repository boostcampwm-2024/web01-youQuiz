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
    // 소켓이 (재)연결될 때마다 서버의 현재 문제를 다시 조회하고, "중간 점검"
    // 화면에 갇혀있었다면 빠져나온다. 이 리스너는 반드시 여기(부모)에 있어야
    // 한다: isQuizEnd===true일 때 렌더되는 QuizEnd는 자체적으로
    // useShowRanking(useSuspenseQuery)을 갖고 있는데, 연결이 끊긴 동안 그
    // 쿼리가 pending 상태로 멈춰 있으면 QuizEnd는 최초 커밋조차 못 하고
    // 계속 재시도만 하므로 그 안의 useEffect(재연결 리스너 포함)가 전혀
    // 실행되지 않는다. 반면 이 컴포넌트(QuizSessionLazyPage) 자신은 이미
    // 성공적으로 렌더된 상태이므로 재연결 이벤트를 안정적으로 받는다.
    // refetch가 끝나기 전에 isQuizEnd를 먼저 false로 바꾸면, 새로 마운트되는
    // QuizHeader가 캐시된 이전 문제의 startTime으로 잠깐 렌더되어 즉시 다시
    // 종료 처리되는 경쟁 조건이 생기므로 refetch 완료를 기다린 뒤 처리한다.
    const handleReconnect = async () => {
      await refetch();
      clearLocalStorage(GUEST_LOCAL_STORAGE_KEYS);
      setIsQuizEnd(false);
    };
    socket.on('connect', handleReconnect);
    return () => {
      socket.off('connect', handleReconnect);
    };
  }, []);

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
