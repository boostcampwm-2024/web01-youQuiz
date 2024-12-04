import { useEffect } from 'react';

import { usePersistState } from '@/shared/hooks/usePersistState';
import { getQuizSocket } from '@/shared/utils/socket';
import { useGetMyInfo } from '../model/hooks/useGetMyInfo';

import DogImage from '@/shared/assets/characters/강아지.png';
import CatImage from '@/shared/assets/characters/고양이.png';
import PigImage from '@/shared/assets/characters/돼지.png';
import RabbitImage from '@/shared/assets/characters/토끼.png';
import PenguinImage from '@/shared/assets/characters/펭귄.png';
import HamsterImage from '@/shared/assets/characters/햄스터.png';
import { Calendar, Clock, Users } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import ProgressBar from './ProgressBar';

interface QuizHeaderProps {
  startTime: number;
  timeLimit: number;
  setQuizEnd: React.Dispatch<React.SetStateAction<boolean>>;
  totalParticipants: number;
  pinCode: string;
}

const characters = [DogImage, CatImage, PigImage, RabbitImage, PenguinImage, HamsterImage];
const characterNames = ['강아지', '고양이', '돼지', '토끼', '펭귄', '햄스터'];

export default function QuizHeader({
  startTime,
  timeLimit,
  setQuizEnd,
  totalParticipants,
  pinCode,
}: QuizHeaderProps) {
  const [remainingTime, setRemainingTime] = usePersistState('ramainingTime', timeLimit);
  const [participantStatistics, setParticipantStatistics] = usePersistState(
    'participantStatistics',
    {
      totalSubmit: 0,
    },
  );
  const socket = getQuizSocket();
  const { data: myInfo } = useGetMyInfo({ socket });
  const { nickname, character } = myInfo;
  const queryClient = useQueryClient();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = timeLimit - Math.floor((Date.now() - startTime) / 1000);
      setRemainingTime(timeLeft);
    }, 1000);
    socket.on('participant statistics', (response) => {
      setParticipantStatistics(response);
    });

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, timeLimit]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setQuizEnd(true);
      queryClient.invalidateQueries({ queryKey: ['showRanking', pinCode] });
    }
  }, [remainingTime]);

  useEffect(() => {});

  return (
    <div className="relative z-10 p-6 max-w-4xl mx-auto pt-8 ">
      <div className="flex-col justify-between items-center bg-white backdrop-blur-sm rounded-2xl shadow-lg pb-4 px-4">
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center p-2">
            <img
              src={characters[character]}
              alt={`${characterNames[character]}character`}
              className="w-16 h-16 rounded-full"
            />
            <h3 className="font-lg text-gray-500">{nickname}</h3>
          </div>
          <div className="flex flex-col gap-3 w-52">
            <div className="flex items-center justify-end space-x-2 pt-6">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{remainingTime}초 남음</span>
            </div>
            <ProgressBar
              type="gradient"
              time={timeLimit}
              remainingTime={remainingTime}
              pauseOnHover={false}
            />
          </div>
        </div>
        <div className="border-t-2 pt-2">
          <div className="flex justify-between h-10">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-lg text-gray-600">
                제출자 {participantStatistics.totalSubmit || 0}/{totalParticipants}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-lg text-gray-600">
                {new Date(startTime).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
