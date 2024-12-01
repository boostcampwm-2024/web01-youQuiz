import { useParams } from 'react-router-dom';

import { getQuizSocket } from '@/shared/utils/socket';
import TopPlayer from './TopPlayer';
import PlayerList from './PlayerList';
import ConfettiBackground from './ConfettiBackground';
import { useLeaderboard } from './model/hooks/useLeaderboard';

export interface Ranking {
  nickname: string;
  score: number;
  character: number;
}

export default function Leaderboard() {
  const { pinCode } = useParams();

  const socket = getQuizSocket();
  const { data, isLoading } = useLeaderboard(socket, pinCode ?? '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    //TODO: 쿠키 삭제 로직
  }

  return (
    <section className="relative w-dvw min-h-dvh h-fit bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <ConfettiBackground />
      <div className="w-full max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl">
        <span className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          최종 결과 🎉
        </span>
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
              <div className="font-bold text-gray-800">{data?.averageScore}점</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
