import { toastController } from '@/features/toast/model/toastController';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useGetPinNumbers = () => {
  return { data: [123456] };
};

export default function MainPage() {
  const [pin, setPin] = useState<string>('');
  const { data: pinNumbers } = useGetPinNumbers();

  const naviagte = useNavigate();
  const toast = toastController();

  const handleClick = () => {
    if (pinNumbers?.includes(Number(pin))) {
      naviagte('nickname');
      return;
    }
    toast.error('유효하지 않은 코드입니다');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <section className="min-h-screen flex flex-col items-center">
      <h1 className="text-6xl font-bold text-primary mt-32 mb-24">You Quiz</h1>

      <div className="w-full max-w-4xl px-4">
        <div className="w-full flex justify-between border-[1.5px] border-primary rounded-xl p-2">
          <input
            type="text"
            placeholder="Join Code"
            className="w-3/4 border-none outline-none p-3 bg-transparent"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-primary text-white text-md font-semibold rounded-xl py-2 px-6"
            onClick={handleClick}
          >
            퀴즈 참가하기
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button className="px-6 py-2 text-primary border border-weak rounded-full hover:bg-primary-light">
          로그인
        </button>
        <button className="px-6 py-2 text-primary border border-weak rounded-full hover:bg-primary-light">
          회원가입
        </button>
      </div>
    </section>
  );
}
