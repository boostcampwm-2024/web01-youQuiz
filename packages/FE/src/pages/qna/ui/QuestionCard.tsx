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
      <button className="flex items-start" onClick={handleMessageIconClick}>
        <MessageIcon stroke="#266CAE" />
      </button>
    </div>
  );
}
