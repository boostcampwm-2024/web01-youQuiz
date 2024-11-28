import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Guest } from '../index';
import { getQuizSocket } from '@/shared/utils/socket';

import DogImage from '@/shared/assets/characters/강아지.png';
import CatImage from '@/shared/assets/characters/고양이.png';
import PigImage from '@/shared/assets/characters/돼지.png';
import RabbitImage from '@/shared/assets/characters/토끼.png';
import PenguinImage from '@/shared/assets/characters/펭귄.png';
import HamsterImage from '@/shared/assets/characters/햄스터.png';

interface UserGridItemProps {
  participant: Guest;
  isMine: boolean;
  otherMessage: string | undefined;
}

const characters = [DogImage, CatImage, PigImage, RabbitImage, PenguinImage, HamsterImage];
const characterNames = ['강아지', '고양이', '돼지', '토끼', '펭귄', '햄스터'];

const randomColor = [
  'bg-gradient-to-br from-blue-400/80 to-blue-500/80 text-white',
  'bg-gradient-to-br from-pink-300/80 to-pink-400/80',
  'bg-gradient-to-br from-yellow-300/80 to-yellow-400/80',
];

export default function UserGridItem({ participant, isMine, otherMessage }: UserGridItemProps) {
  // 내 메시지, 상대방들 메시지
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const socket = getQuizSocket();
  const { pinCode } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.emit('message', { pinCode, message: e.target.value, position: participant.position });
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      //메세지 전송
      setIsFocused(false);

      setTimeout(() => {
        socket.emit('message', {
          pinCode,
          message: '',
          position: participant.position,
        });
        setMessage('');
      }, 1500);
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
    <div key={participant.position} className="relative w-full h-24 flex flex-col items-center">
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
      {!isFocused && message && (
        <div
          className={`flex items-center absolute -top-7 left-1/2 transform -translate-x-1/2 ${randomColor[participant.position % 3]} px-2 h-6 rounded-lg shadow-sm text-sm font-bold whitespace-nowrap`}
        >
          {message}
        </div>
      )}
      <div
        className={`relative w-20 h-20 rounded-full aspect-square flex items-center justify-center shadow-sm hover:shadow transition-shadow ${
          isMine ? 'bg-blue-500' : 'bg-white'
        }`}
      >
        <img
          src={characters[participant.character]}
          alt={`${characterNames[participant.character]}character`}
          className="w-20 h-20 rounded-full"
        />
        {!isMine && otherMessage && (
          <div
            className={`flex items-center absolute -top-7 left-1/2 transform -translate-x-1/2 ${randomColor[participant.position % 3]} px-2 h-6 rounded-lg shadow-sm text-sm font-semibold whitespace-nowrap`}
          >
            {otherMessage}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center gap-2 w-full mt-2">
        <div className="w-[10px] h-[10px] rounded-full bg-green-500 animate-blink" />
        <div className="text-sm text-center truncate font-bold">{participant.nickname}</div>
      </div>
    </div>
  );
}
