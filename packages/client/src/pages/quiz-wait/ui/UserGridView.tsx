import { useState, useEffect } from 'react';

import { Guest } from '../index.lazy';
import UserGridItem from './UserGridItem';
import { getQuizSocket } from '@/shared/utils/socket';

interface UserGridViewProps {
  guests: Guest[];
  myPosition: number;
}

export default function UserGridView({ guests, myPosition }: UserGridViewProps) {
  const [otherMessage, setOtherMessage] = useState<Map<number, string>>(new Map<number, string>());
  const [masterMessage, setMasterMessage] = useState<string>('');

  const socket = getQuizSocket();

  useEffect(() => {
    socket.on('message', (response) => {
      if (response.position === -1) {
        setMasterMessage(response.message);
      } else {
        setOtherMessage((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(response.position, response.message);
          return newMap;
        });
      }
    });
  }, []);

  return (
    <div className="relative w-full bg-blue-100 rounded-xl shadow-md">
      <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-4xl font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
        {masterMessage}
      </span>
      <div className="grid grid-cols-8 gap-16 p-8">
        {Array.from({ length: 32 }).map((_, index) => {
          if (index >= guests.length) {
            return (
              <div key={index} className={`flex flex-col items-center`}>
                <div className="w-20 h-20 bg-white/60 rounded-full"></div>
                <div className="w-16 h-4 bg-white/60 rounded-md mt-2"></div>
              </div>
            );
          }
          const participant = guests[index];
          return (
            <UserGridItem
              participant={participant}
              isMine={myPosition === participant.position}
              otherMessage={otherMessage.get(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
