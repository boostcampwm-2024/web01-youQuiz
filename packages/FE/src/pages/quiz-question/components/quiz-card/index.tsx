import { QuizData } from '@/pages/quiz-question';
import MessageIcon from '@/shared/assets/icons/message.svg?react';

interface QuizCardProps {
  isSelected: boolean;
  quizData: QuizData;
  onClick: () => void;
}

export default function QuizCard({ isSelected, quizData, onClick }: QuizCardProps) {
  return (
    <div className="flex flex-col justify-center gap-6 w-[1250px] h-40 border-border border-2 rounded-base bg-white p-7">
      <div className="flex gap-5">
        <span className={`${isSelected && 'text-primary'} font-bold text-[18px]`}>
          Quiz {quizData.quizIndex + 1}.
        </span>
        <span className="font-bold text-[18px]">{quizData.title}</span>
      </div>
      <div className="flex gap-6">
        <div className="flex gap-4 items-center rounded-base bg-border w-[1150px] h-14 px-4 py-5">
          <span className={`${quizData.isCorrect ? 'text-primary' : 'text-red-100'} font-semibold`}>
            {quizData.guestChoice + 1}번.
          </span>
          <span className="font-semibold">{quizData.choices[quizData.guestChoice]}</span>
        </div>
        <div
          className={`flex justify-center items-center w-14 h-14 ${isSelected ? 'bg-primary' : 'bg-weak'} rounded-full cursor-pointer`}
          onClick={onClick}
        >
          <MessageIcon stroke={`${isSelected ? '#ffffff' : '#2c2c2c'}`} />
        </div>
      </div>
    </div>
  );
}
