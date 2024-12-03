import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Users, PlayCircle } from 'lucide-react';

import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';
import { toastController } from '@/features/toast/model/toastController';
import { apiClient } from '@/shared/api';
import UserGridView from './ui/UserGridView';
import { useNickname } from './model/hooks/useNickname';
import MasterChat from './ui/MasterChat';

export interface Guest {
  nickname: string;
  character: number;
  position: number;
}

export default function QuizWaitLazyPage() {
  const socket = getQuizSocket();
  const { pinCode } = useParams();
  const {
    data: { participantList, myPosition },
    refetch,
  } = useNickname(socket, pinCode ?? '', getCookie('sid') ?? '');
  const [userType, setUserType] = useState<string>('');

  const guestLink = `${import.meta.env.VITE_CLIENT_URL}/nickname/${pinCode}`;
  const toast = toastController();

  const navigate = useNavigate();

  useEffect(() => {
    const handleParticipantNotice = () => {
      refetch();
    };
    socket.on('participant notice', handleParticipantNotice);

    const fetchUserType = async () => {
      const response = await apiClient.get(`/games/${pinCode}/sid/${getCookie('sid')}`);
      setUserType(response.type);
    };

    socket.on('start quiz', () => {
      navigate(`/quiz/session/${pinCode}/1`);
    });

    fetchUserType();

    return () => {
      socket.off('participant notice', handleParticipantNotice);
    };
  }, []);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(guestLink);
      toast.success('링크가 복사되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleQuizStart = () => {
    socket.emitWithAck('start quiz', { sid: getCookie('sid'), pinCode }).then(() => {
      navigate(`/quiz/session/host/${pinCode}/0`);
    });
  };

  return (
    <div className="flex justify-center gap-4 pt-8">
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="w-full bg-white rounded-xl shadow-md p-6">
          <div className="relative flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold px-4 py-2 rounded-xl bg-gray-100">
                <span className="text-gray-500">Pin : </span>
                {pinCode}
              </div>
              <div
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
                링크 복사하기
              </div>
            </div>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit flex items-center gap-2 justify-center font-medium text-md text-gray-700">
              <span className="text-blue-500 font-bold"> / </span>입력 시 채팅을 칠 수 있어요.
            </p>
            <p className="flex items-center gap-6 font-bold text-lg">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-2xl">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">{participantList.length}명</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-500 font-medium">참가 대기중</span>
              </div>
            </p>
          </div>
          <UserGridView guests={participantList} myPosition={myPosition} />
        </div>
        {userType === 'master' && (
          <div className="relative flex justify-end min-w-full">
            <MasterChat pinCode={pinCode ?? ''} />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
              onClick={handleQuizStart}
            >
              <PlayCircle className="w-6 h-6 text-white" />
              퀴즈 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
