import { useRef, useEffect, useState } from 'react';

import { Guest } from '../index';

interface UserGridItemProps {
  participant: Guest;
  isMine: boolean;
}

const characterNames = ['강아지', '고양이', '돼지', '토끼', '펭귄', '햄스터'];

export default function UserGridItem({ participant, isMine }: UserGridItemProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      //메세지 전송
      setIsFocused(false);
      setMessage('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setIsFocused(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      {isMine && isFocused && (
        <>
          <input
            ref={inputRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleEnterKeyDown}
            className="absolute -top-7 rounded-md shadow-sm outline-none px-2 w-40 h-6 text-sm"
          />
          <div
            className="absolute inset-0 -top-1 left-12 w-0 h-0
              border-l-[8px] border-l-transparent
              border-t-[10px] border-t-white
              border-r-[8px] border-r-transparent
              drop-shadow-[0_0.7px_0.7px_rgba(0,0,0,0.1)]
              "
          />
        </>
      )}
      <div
        className={`relative w-20 h-20 aspect-square  rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow ${
          isMine ? 'bg-blue-500' : 'bg-white'
        }`}
      >
        <img
          src={`/src/shared/assets/characters/${characterNames[participant.character]}.png`}
          alt={`${characterNames[participant.character]}character`}
          className="w-20 h-20 rounded-full"
        />
        {participant.message && (
          <input
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-sm text-sm whitespace-nowrap"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        )}
      </div>
      <div className="flex justify-center items-center gap-2 w-full mt-2">
        <div className="w-[10px] h-[10px] rounded-full bg-green-500 animate-blink" />
        <div className="text-sm text-center truncate">{participant.nickname}</div>
      </div>
    </div>
  );
}
