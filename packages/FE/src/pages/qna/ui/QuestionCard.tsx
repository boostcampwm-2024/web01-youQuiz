import MessageIcon from '@/shared/assets/icons/message.svg?react';

interface QuestionCardProps {
  isSelected: boolean;
  question: {
    index: number;
    description: string;
  };
  setSelectedComment: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

export default function QuestionCard({
  isSelected,
  question,
  index,
  setSelectedComment,
}: QuestionCardProps) {
  const handleMessageIconClick = () => {
    if (isSelected) {
      setSelectedComment(-1);
      return;
    }
    setSelectedComment(index);
  };

  return (
    <div className="flex justify-between w-[1000px] h-28 p-5 bg-white rounded-base">
      <div className="flex flex-col gap-7">
        <span className="text-textWeak">{question.index}번 퀴즈</span>
        <span>{question.description}</span>
      </div>
      <div
        className={`flex justify-center items-center w-14 h-14 ${isSelected ? 'bg-primary' : 'bg-weak'} rounded-full cursor-pointer`}
        onClick={handleMessageIconClick}
      >
        <MessageIcon stroke={`${isSelected ? '#ffffff' : '#2c2c2c'}`} />
      </div>
    </div>
  );
}
