import { useState } from 'react';

import ProgressBar from '@/shared/ui/progress-bar/ProgressBar';
import CustomButton from '@/shared/ui/buttons/CustomButton';
import QuizForm from './ui/QuizForm';

// TODO: 제출하기 버튼 API 연동
// TODO: 타이머 종료 시 다음 퀴즈 페이지로 이동

const OPTIONS = ['A', 'B', 'C', 'D'];

export default function QuizSession() {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    setSelectedOptions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }
      return [...prev, index];
    });
  };

  return (
    <div>
      <ProgressBar
        time={10}
        type="success"
        barShape="rounded"
        handleAnimationEnd={() => {
          alert('end');
        }}
      />
      <div className="flex flex-col justify-center items-center  pt-[100px]">
        <QuizForm options={OPTIONS} selectedOptions={selectedOptions} onToggle={handleToggle} />
        <div className="flex justify-center">
          <CustomButton label="제출하기" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
