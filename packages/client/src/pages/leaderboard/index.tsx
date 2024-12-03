import { useNavigate, useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import TopPlayer from './TopPlayer';
import PlayerList from './PlayerList';
import ConfettiBackground from './ConfettiBackground';
import { useLeaderboard } from './model/hooks/useLeaderboard';
import { deleteCookie } from '@/shared/utils/cookie';
import { LogOut } from 'lucide-react';
import LoadingSpinner from '@/shared/assets/icons/loading-alt-loop.svg?react';

export interface Ranking {
  nickname: string;
  score: number;
  character: number;
}

export default function Leaderboard() {
  const { pinCode } = useParams();

  const socket = getQuizSocket();
  const { data, isLoading } = useLeaderboard(socket, pinCode ?? '');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <LoadingSpinner className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (data) {
    deleteCookie('sid');
  }

  return (
    <section className="relative w-dvw min-h-dvh h-fit bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <ConfettiBackground />
      <div className="w-full max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            최종 결과 🎉
          </span>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 
                  bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 
                   hover:text-gray-900 hover:border-gray-300 transition-all duration-200 ease-in-out
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            onClick={() => navigate('/')}
          >
            <LogOut className="h-4 w-4 mr-2" />
            나가기
          </button>
        </div>
        <div className="flex justify-center ">
          <div className="w-full">
            <TopPlayer players={data?.rankerData.slice(0, 3) ?? []} />
          </div>
        </div>
        {/* 랭킹 리스트 */}
        <PlayerList players={data?.rankerData.slice(3) ?? []} />
        <div className="mt-8 p-4 bg-white/50 rounded-xl border border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2">
              <div className="text-sm text-gray-500 mb-1">참가자</div>
              <div className="font-bold text-gray-800">{data?.participantNumber}명</div>
            </div>
            <div className="p-2 border-x border-gray-100">
              <div className="text-sm text-gray-500 mb-1">평균 점수</div>
              <div className="font-bold text-gray-800">
                {Number(data?.averageScore.toFixed(1))}점
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
