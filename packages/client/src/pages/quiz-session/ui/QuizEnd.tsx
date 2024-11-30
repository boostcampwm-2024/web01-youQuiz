import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';

const Nickname = ({ nickname }: { nickname: string }) => {
  return (
    <div className="text-xl font-semibold rounded-base bg-white p-2 shadow-md text-gray-600">
      {nickname}
    </div>
  );
};

export default function QuizEnd() {
  const socket = getQuizSocket();
  const { pinCode } = useParams();

  const [ranking, setRanking] = useState<any>([]);

  useEffect(() => {
    socket.emit('show ranking', { pinCode, sid: getCookie('sid') }, (response: any) => {
      setRanking(response);
      console.log(response);
    });
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
                {ranking.rankerDatas?.[1]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerDatas?.[1]?.nickname} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-64 bg-gradient-to-t from-yellow-300 to-yellow-50 rounded-base">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
                {ranking.rankerDatas?.[0]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerDatas?.[0]?.nickname} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-44 bg-gradient-to-t from-orange-300 to-orange-200 rounded-base">
              <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
                {ranking.rankerDatas?.[2]?.score}
              </span>
            </div>
            <Nickname nickname={ranking.rankerDatas?.[2]?.nickname} />
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
