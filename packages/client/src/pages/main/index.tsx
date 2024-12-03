import { toastController } from '@/features/toast/model/toastController';
import { getPincodeExist, checkPincodePossible, checkPincodeStatus } from '@/shared/api/games';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingSquare from './ui/FloatingSquare';
import FloatingQuestion from './ui/FloatingQuestion';
import { getCookie } from '@/shared/utils/cookie';

const mappingGameStatus = (status: string, pinCode: string) => {
  switch (status) {
    case 'WAITING':
      return `/quiz/wait/${pinCode}`;
    case 'IN PROGRESS':
      return `/quiz/session/${pinCode}/1`;
    case 'LEADERBOARD':
      return `/quiz/session/${pinCode}/end`;
    case 'END':
      return `/quiz/session/${pinCode}/end`;
    default:
      return '/';
  }
};

export default function MainPage() {
  const [pinCode, setPinCode] = useState<string>('');
  const navigate = useNavigate();
  const toast = toastController();

  const handleClick = async () => {
    if (!pinCode) {
      toast.warning('코드를 입력해주세요.');
      return;
    }
    const response = await getPincodeExist(pinCode);

    if (response.isExist) {
      const sid = getCookie('sid');
      if (sid) {
        const response = await checkPincodeStatus(pinCode, sid);
        if (response.isPossible) {
          const status = response.gameStatus;
          const path = mappingGameStatus(status, pinCode);
          navigate(path);
        } else {
          toast.info('게임이 종료되었습니다.');
        }
      } else {
        const checkResponse = await checkPincodePossible(pinCode);
        console.log(checkResponse);
        if (checkResponse.isPossible) {
          navigate(`/nickname/${pinCode}`);
        } else {
          toast.warning('방이 가득 찼습니다.');
        }
      }
      return;
    }
    toast.error('잘못된 코드입니다.');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleCreateQuiz = () => {
    navigate('quiz-list');
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex flex-col items-center justify-center p-8 overflow-hidden">
      <FloatingSquare
        color="from-yellow-300/80 to-yellow-400/80"
        size="128"
        position="top-20 left-[20%]"
        delay={0}
      />
      <FloatingSquare
        color="from-green-300/80 to-green-400/80"
        size="160"
        position="top-40 right-[20%]"
        delay={0.5}
      />
      <FloatingSquare
        color="from-blue-400/80 to-blue-500/80"
        size="192"
        position="bottom-20 left-[20%]"
        delay={1}
      />
      <FloatingSquare
        color="from-pink-300/80 to-pink-400/80"
        size="144"
        position="bottom-40 right-[20%]"
        delay={1.5}
      />
      <FloatingQuestion position="top-[170px] right-1/3" delay={0} />
      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 text-transparent bg-clip-text mb-4">
          You Quiz
        </h1>
        <p className="text-xl text-blue-600/70">함께 만드는 즐거운 퀴즈 시간</p>
      </div>
      <div className="w-[720px] bg-white/80 backdrop-blur-xl px-6 py-3 rounded-3xl shadow-xl border border-blue-100 mb-8 transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="참가 코드를 입력하세요"
            className="flex-1 h-14 text-lg rounded-xl bg-transparent border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-blue-600 placeholder:text-blue-300 focus:outline-none"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`h-14 px-8 bg-gradient-to-r from-blue-500 to-sky-500 ${pinCode ? 'hover:from-blue-600 hover:to-sky-600' : ''}  rounded-xl text-white shadow-lg shadow-blue-500/30 cursor-pointer`}
            onClick={handleClick}
          >
            퀴즈 참가하기
          </button>
        </div>
      </div>
      <div className="text-center space-y-4 mt-16">
        <p className="text-lg text-blue-600/70">나만의 특별한 퀴즈로 새로운 경험을 만들어보세요!</p>
        <div className="flex-1 transition-transform duration-200 hover:scale-105 active:scale-95">
          <button
            className="w-[350px] h-12 bg-white/70 hover:bg-white/90 backdrop-blur-xl border-blue-200 text-blue-600 hover:text-blue-700 rounded-lg"
            onClick={handleCreateQuiz}
          >
            퀴즈 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
