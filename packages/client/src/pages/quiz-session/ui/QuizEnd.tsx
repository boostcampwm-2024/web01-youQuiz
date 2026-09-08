import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import { useShowRanking } from '../model/hooks/useShowRanking';
import { clearLocalStorage } from '@/shared/utils/clearLocalStorage';
import { GUEST_LOCAL_STORAGE_KEYS } from '@/shared/constants/guestLocalStorageKey';
interface QuizEndProps {
  quizOrder: number;
  refetch: () => void;
  setQuizEnd: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nickname = ({ nickname }: { nickname: string }) => {
  return (
    <div className="text-xl font-semibold rounded-base bg-white p-2 shadow-md text-gray-600">
      {nickname}
    </div>
  );
};

export default function QuizEnd({ refetch, setQuizEnd }: QuizEndProps) {
  const socket = getQuizSocket();
  const navigate = useNavigate();
  const { pinCode, id } = useParams();
  const { data: ranking } = useShowRanking({ socket, pinCode: pinCode as string });

  useEffect(() => {
    const handleStartQuiz = () => {
      clearLocalStorage(GUEST_LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/${pinCode}/${parseInt(id as string) + 1}`);
      setQuizEnd(false);
      refetch();
    };

    const handleEndQuiz = () => {
      clearLocalStorage(GUEST_LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/${pinCode}/end`);
    };

    // 재연결 시 이 화면을 벗어나는 처리는 여기(QuizEnd)가 아니라 부모
    // QuizSessionLazyPage가 담당한다. 이 컴포넌트는 useShowRanking
    // (useSuspenseQuery)에 의존하는데, 연결이 끊긴 동안 그 쿼리가 pending
    // 상태로 멈춰 있으면 QuizEnd는 최초 커밋조차 못 해 이 useEffect 자체가
    // 실행되지 않는다 - 즉 여기에 재연결 리스너를 둬도 정작 필요한 순간에
    // 등록되어 있지 않을 수 있다(실측으로 확인됨). 항상 성공적으로 렌더된
    // 상태를 유지하는 부모에서 처리하는 것이 안전하다.
    socket.on('start quiz', handleStartQuiz);
    socket.on('end quiz', handleEndQuiz);

    return () => {
      socket.off('start quiz', handleStartQuiz);
      socket.off('end quiz', handleEndQuiz);
    };
  }, []);

  return (
    <div className="h-dvh bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-2xl mx-auto mt-12 p-12 ">
        <div className="text-center mb-8">
          <span className="text-4xl font-semibold text-gray-600">🏆 중 간 점 검</span>
        </div>

        <div className="flex justify-center items-end gap-20 mb-12 p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-52 bg-gradient-to-t from-gray-300 to-gray-200 rounded-base">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
                {ranking.rankerData?.[1]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerData?.[1]?.nickname} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-64 bg-gradient-to-t from-yellow-300 to-yellow-50 rounded-base">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
                {ranking.rankerData?.[0]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerData?.[0]?.nickname} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-44 bg-gradient-to-t from-orange-300 to-orange-200 rounded-base">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
                {ranking.rankerData?.[2]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerData?.[2]?.nickname} />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <span className="text-semibold text-2xl text-gray-600">
            <span className="text-blue-600">"{ranking.myNickname}"</span> 님은?
          </span>
          <span className="font-semibold text-4xl text-blue-600">{ranking.myRank + 1} 등</span>
          <span className="font-semibold text-3xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {ranking.myScore}점
          </span>
        </div>
      </div>
    </div>
  );
}
