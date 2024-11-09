import TrophyIcon from '@/shared/assets/icons/tropyhy.svg?react';
import AvatarIcon from '@/shared/assets/icons/avatar.svg?react';

import { useState } from 'react';
import { CustomButton } from '@/shared/ui/buttons';

export default function Nickname() {
  const [nickname, setNickname] = useState('');

  const handleNicknameSubmit = (nickname: string) => {
    // TODO: API 연동 후 submit 함수 구현
    console.log(nickname);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNicknameSubmit(nickname);
    }
  };

  return (
    <div className="flex flex-col items-center px-64 pt-16 min-w-[980px]">
      <div className="flex flex-col items-center gap-3 w-fit">
        <label
          htmlFor="nickname"
          className="flex gap-2 ml-1 items-center text-xl font-bold self-start"
        >
          <TrophyIcon />
          클래스 이름
        </label>
        <div className="flex gap-3 items-center w-[650px] h-16 p-4 border-2 rounded-base border-border">
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-weak">
            <AvatarIcon />
          </div>
          <input
            type="text"
            id="nickname"
            placeholder="Your Name"
            className="w-[488px] bg-transparent focus:outline-none"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={`w-20 h-10 text-white bg-primary rounded-3xl ${
              nickname.length === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
            }`}
            disabled={nickname.length === 0}
          >
            Join
          </button>
        </div>
      </div>
      <div className="flex self-end mt-[640px]">
        <CustomButton
          type="full"
          color="primary"
          label="퀴즈 시작하기"
          size="md"
          onClick={() => handleNicknameSubmit(nickname)}
        />
      </div>
    </div>
  );
}
