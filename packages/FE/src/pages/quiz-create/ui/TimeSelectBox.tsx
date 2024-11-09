import { Dispatch, SetStateAction } from 'react';

interface TimeSelectBoxProps {
  setTime: Dispatch<SetStateAction<number>>;
  setShowTimeSelect: Dispatch<SetStateAction<boolean>>;
}

const TIMES = [10, 20, 30, 40, 0];
export default function TimeSelectBox({ setTime, setShowTimeSelect }: TimeSelectBoxProps) {
  return (
    <div className="absolute w-[100px] left-6 bg-white rounded-base border overflow-hidden z-10">
      <ul>
        {TIMES.map((time) => (
          <li
            key={time}
            onClick={() => {
              setTime(time);
              setShowTimeSelect(false);
            }}
            className="cursor-pointer text-weak-md text-center border-b py-1"
          >
            {time === 0 ? '제한없음' : `${time}초`}
          </li>
        ))}
      </ul>
    </div>
  );
}
