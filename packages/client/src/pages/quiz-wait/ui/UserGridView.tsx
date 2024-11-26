import { useState } from 'react';

interface Guest {
  nickname: string;
  character: number;
  message: string;
  position: number;
}

interface UserGridViewProps {
  guests: Guest[];
}

const characterNames = ['강아지', '고양이', '돼지', '토끼', '펭귄', '햄스터'];

export default function UserGridView({ guests }: UserGridViewProps) {
  const [message, setMessage] = useState('');

  return (
    <div className="w-full bg-blue-50 rounded-xl shadow-md">
      <div className="grid grid-cols-6 gap-4 p-8">
        {Array.from({ length: 30 }).map((_, index) => {
          if (index >= guests.length) {
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                <div className="w-16 h-4 bg-gray-200 rounded-md mt-2"></div>
              </div>
            );
          }
          const participant = guests[index];
          return (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-20 h-20 aspect-square bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow">
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
        })}
      </div>
    </div>
  );
}
