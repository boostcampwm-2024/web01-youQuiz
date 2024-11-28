import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomButton } from '@/shared/ui/buttons';
import { setCookie } from '@/shared/utils/cookie';
import { getQuizSocket } from '@/shared/utils/socket';
import { waitForSocketEvent } from '@/shared/utils/waitForSocketEvent';
import { QuizData } from '@/pages/quiz-create';
import DownArrowIcon from '@/shared/assets/icons/down-arrow.svg?react';
import BinIcon from '@/shared/assets/icons/bin.svg?react';
import { useDeleteClass } from '@/shared/hooks/classes';

type QuizList = QuizData[];

interface Quiz {
  id: number;
  title: string;
}

interface ClassItemProps {
  quiz: Quiz;
  index: number;
  quizList: QuizList[];
}

export default function ClassItem({ quiz, index, quizList }: ClassItemProps) {
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);

  const mutation = useDeleteClass();
  const navigate = useNavigate();

  const handleSelectClass = (index: number) => {
    if (selectedClassIndex === index) {
      setSelectedClassIndex(-1);
      return;
    }
    setSelectedClassIndex(index);
  };

  const handleQuizStart = async (id: number) => {
    const socket = getQuizSocket();
    socket.emit('master entry', { classId: id });
    /**비동기 작업 */
    const sid = await waitForSocketEvent('session', socket);
    setCookie('sid', sid);

    const pinCode = await waitForSocketEvent('pincode', socket);
    setCookie('pinCode', pinCode);

    navigate(`/quiz/wait/${pinCode}`);
  };

  const handleDeleteClass = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    mutation.mutate(quiz.id);
  };

  return (
    <>
      <div
        className={`flex justify-between itemds-center min-w-content h-20 items-center bg-white ${selectedClassIndex === index ? 'border-secondary' : 'border-border'}  border rounded-base p-6 cursor-pointer`}
        onClick={() => handleSelectClass(index)}
      >
        <span>{quiz.title}</span>
        <div className="flex gap-4">
          <button type="button" onClick={handleDeleteClass}>
            <BinIcon className="w-5 h-5 text-red-500" />
          </button>
          <CustomButton
            type="full"
            label="퀴즈 시작하기"
            color="secondary"
            onClick={() => handleQuizStart(quiz.id)}
          />
          <button type="button" onClick={() => handleSelectClass(index)}>
            <DownArrowIcon
              stroke="#000000"
              className={selectedClassIndex === index ? 'rotate-180' : 'rotate-0'}
            />
          </button>
        </div>
      </div>
      {selectedClassIndex === index && (
        <div
          className={`flex flex-col gap-3 p-6 mt-4 border ${selectedClassIndex === index ? 'border-secondary' : 'border-border'} rounded-base bg-white`}
        >
          {quizList[index].map((quizData, index) => (
            <span key={quizData.content}>
              {index + 1}번 문제: {quizData.content}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
