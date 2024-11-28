import { CustomButton } from '@/shared/ui/buttons';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';
import { toastController } from '@/features/toast/model/toastController';
import LoadingSpinner from '@/shared/assets/icons/loading-alt-loop.svg?react';
import { apiClient } from '@/shared/api';
import UserGridView from './ui/UserGridView';

export interface Guest {
  nickname: string;
  character: number;
  position: number;
}

export default function QuizWait() {
  const { pinCode } = useParams();
  const [userType, setUserType] = useState<string>('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [myPosition, setMyPosition] = useState<number>(-1);

  const guestLink = `${import.meta.env.VITE_CLIENT_URL}/nickname/${pinCode}`;
  const socket = getQuizSocket();
  const toast = toastController();

  const navigate = useNavigate();

  useEffect(() => {
    const handleMyPosition = (response: any) => {
      const { participantList, myPosition } = response;
      setGuests(participantList);
      setMyPosition(myPosition);
    };

    socket.on('my position', handleMyPosition);

    const handleNickname = (response: any) => {
      const { participantList } = response;
      setGuests(participantList);
    };

    socket.on('nickname', handleNickname);

    const fetchUserType = async () => {
      const response = await apiClient.get(`/games/${pinCode}/sid/${getCookie('sid')}`);
      setUserType(response.type);
    };

    socket.on('start quiz', (response) => {
      console.log('start quiz', response);
      navigate(`/quiz/session/${pinCode}/1`);
    });

    fetchUserType();

    return () => {
      socket.off('nickname', handleNickname);
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
    socket.emit('start quiz', { sid: getCookie('sid'), pinCode });
    navigate(`/quiz/session/host/${pinCode}/1`);
  };

  return (
    <div className="flex justify-center gap-6 pt-8">
      <div className="flex flex-col justify-center items-center gap-16 h-80 bg-white p-10 rounded-xl shadow-md">
        <QRCodeSVG value={guestLink} />
        <div>
          <CustomButton
            type="full"
            color="primary"
            label="COPY LINK!"
            size="md"
            onClick={handleCopyLink}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="w-[1300px] bg-white rounded-xl shadow-md p-10">
          <div className="relative flex justify-end items-center mb-4">
            <p className="font-bold text-2xl absolute inset-0 flex items-center justify-center">
              참가 대기 중
            </p>
            <div className="text-lg font-bold px-3 py-1 rounded-full bg-gray-100">
              PIN: {pinCode}
            </div>
            <p className="flex items-center gap-2 font-bold text-lg ml-auto">
              <LoadingSpinner className="animate-spin" />
              {guests.length === 0 ? 'no' : guests.length} participants
            </p>
          </div>
          <UserGridView guests={guests} myPosition={myPosition} />
        </div>
        {userType === 'master' && (
          <div className="flex justify-end min-w-full">
            <CustomButton
              type="full"
              color="primary"
              label="퀴즈 시작하기"
              size="md"
              onClick={handleQuizStart}
            />
          </div>
        )}
      </div>
    </div>
  );
}
