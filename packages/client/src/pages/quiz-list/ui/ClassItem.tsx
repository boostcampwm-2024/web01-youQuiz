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

interface Quiz {
  id: number;
  title: string;
  quizzes: QuizData[];
}

interface ClassItemProps {
  quizList: Quiz;
  index: number;
}

export default function ClassItem({ index, quizList }: ClassItemProps) {
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);

  const mutation = useDeleteClass();
  const navigate = useNavigate();

  const handleSelectClass = (index: number, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedClassIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const handleQuizStart = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const socket = getQuizSocket();
    socket.emit('master entry', { classId: id });

    const sid = await waitForSocketEvent('session', socket);
    setCookie('sid', sid);

    const pinCode = await waitForSocketEvent('pincode', socket);
    setCookie('pinCode', pinCode);

    navigate(`/quiz/wait/${pinCode}`);
  };

  const handleDeleteClass = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    mutation.mutate(id);
  };

  return (
    <>
      <div
        className={`flex justify-between items-center min-w-content h-20 bg-white shadow-sm border rounded-base p-6 cursor-pointer`}
        onClick={(e) => handleSelectClass(index, e)}
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{quizList.title}</span>
          <span className="text-sm font-semibold text-gray-500">
            문제 {quizList.quizzes.length !== 0 ? `${quizList.quizzes.length}개` : '없음'}
          </span>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={(e) => handleDeleteClass(e, quizList.id)}>
            <BinIcon className="w-5 h-5 text-red-500" />
          </button>
          <CustomButton
            type="full"
            label="퀴즈 시작하기"
            color="secondary"
            onClick={(e) => handleQuizStart(quizList.id, e)}
          />
          <button type="button" onClick={(e) => handleSelectClass(index, e)}>
            <DownArrowIcon
              stroke="#000000"
              className={selectedClassIndex === index ? 'rotate-180' : 'rotate-0'}
            />
          </button>
        </div>
      </div>
      {selectedClassIndex === index && (
        <div className={`flex flex-col gap-1 p-4 -mt-4 border shadow-sm rounded-base bg-white`}>
          {quizList.quizzes.length === 0 && (
            <span className="text-md font-semibold text-gray-600">퀴즈가 없습니다.</span>
          )}
          {quizList.quizzes.map((quizData, quizIndex) => (
            <span key={`${quizData.content} ${quizIndex}`}>
              <span className="text-md font-bold text-secondary">Q{quizIndex + 1}: </span>
              <span className="text-md font-semibold text-gray-600">{quizData.content}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
