import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import { useShowRanking } from '../model/hooks/useShowRanking';
import { clearLocalStorage } from '@/shared/utils/clearLocalStorage';
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

const LOCAL_STORAGE_KEYS = [
  'isQuizEnd',
  'reactionStats',
  'participantStatistics',
  'hasSubmitted',
  'submitOrder',
  'remianingTime',
];

export default function QuizEnd({ refetch, setQuizEnd }: QuizEndProps) {
  const socket = getQuizSocket();
  const navigate = useNavigate();
  const { pinCode, id } = useParams();

  const { data: ranking } = useShowRanking({ socket, pinCode: pinCode as string });
  console.log(ranking);
  // TODO: localStorage 삭제하기
  useEffect(() => {
    const handleStartQuiz = () => {
      clearLocalStorage(LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/${pinCode}/${parseInt(id as string) + 1}`);
      setQuizEnd(false);
      refetch();
    };

    const handleEndQuiz = () => {
      clearLocalStorage(LOCAL_STORAGE_KEYS);
      navigate(`/quiz/session/${pinCode}/end`);
    };

    socket.on('start quiz', handleStartQuiz);
    socket.on('end quiz', handleEndQuiz);

    return () => {
      socket.off('start quiz', handleStartQuiz);
      socket.off('end quiz', handleEndQuiz);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-78px)] bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="max-w-2xl mx-auto mt-12 p-16 ">
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
