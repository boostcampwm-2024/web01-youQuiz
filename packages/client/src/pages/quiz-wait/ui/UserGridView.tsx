import { Guest } from '../index';
import UserGridItem from './UserGridItem';

interface UserGridViewProps {
  guests: Guest[];
}

export default function UserGridView({ guests }: UserGridViewProps) {
  console.log(guests);

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

          return <UserGridItem participant={participant} isMine={participant.isMine} />;
        })}
      </div>
    </div>
  );
}
