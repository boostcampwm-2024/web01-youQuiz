import { Ranking } from '.';
import DogImage from '@/shared/assets/characters/강아지.png';
import CatImage from '@/shared/assets/characters/고양이.png';
import PigImage from '@/shared/assets/characters/돼지.png';
import RabbitImage from '@/shared/assets/characters/토끼.png';
import PenguinImage from '@/shared/assets/characters/펭귄.png';
import HamsterImage from '@/shared/assets/characters/햄스터.png';

interface TopPlayerProps {
  players: Ranking[];
}

const characters = [DogImage, CatImage, PigImage, RabbitImage, PenguinImage, HamsterImage];
const characterNames = ['강아지', '고양이', '돼지', '토끼', '펭귄', '햄스터'];

const Nickname = ({ nickname }: { nickname: string }) => {
  return (
    <div className="text-xl font-semibold rounded-base bg-white p-2 shadow-md text-gray-600">
      {nickname}
    </div>
  );
};
export default function TopPlayer({ players }: TopPlayerProps) {
  return (
    <div className="flex justify-center items-end gap-20 p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full w-24 h-24 ">
          <img
            src={characters[players[1]?.character] ?? DogImage}
            alt={`${characterNames[players[1]?.character]}character`}
          />
        </div>
        <div className="relative w-24 h-28 bg-gradient-to-t from-gray-300 to-gray-200 rounded-base">
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
            {players[1]?.score}
          </span>
        </div>
        <Nickname nickname={players[1]?.nickname} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full w-24 h-24 ">
          <img
            src={characters[players[0]?.character] ?? DogImage}
            alt={`${characterNames[players[0]?.character]}character`}
          />
        </div>
        <div className="relative w-28 h-40 bg-gradient-to-t from-yellow-300 to-yellow-50 rounded-base">
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
            {players[0]?.score}
          </span>
        </div>
        <Nickname nickname={players[0]?.nickname} />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full w-24 h-24 ">
          <img
            src={characters[players[2]?.character] ?? DogImage}
            alt={`${characterNames[players[2]?.character]}character`}
          />
        </div>
        <div className="relative w-24 h-20 bg-gradient-to-t from-orange-300 to-orange-200 rounded-base">
          <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-semibold text-gray-600">
            {players[2]?.score}
          </span>
        </div>
        <Nickname nickname={players[2]?.nickname} />
      </div>
    </div>
  );
}
