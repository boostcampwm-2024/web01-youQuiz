import { useState } from 'react';

import { CustomButton } from '@/shared/ui/buttons';
import PlusIcon from '@/shared/assets/icons/plus.svg?react';
import QuizCreateSection from './ui/QuizCreateSection';
import { useParams } from 'react-router-dom';
import { useCreateQuiz } from '@/shared/hooks/quizzes';

interface Choice {
  content: string;
  isCorrect: boolean;
  position: number;
}

export interface QuizData {
  content: string;
  quizType: 'MC' | 'TF';
  timeLimit: number;
  point: number;
  position: number;
  choices: Choice[];
}

const INITIAL_QUIZ_VALUE: QuizData = {
  content: '',
  quizType: 'MC',
  timeLimit: 30,
  point: 1000,
  position: 0,
  choices: [
    { content: '', isCorrect: false, position: 0 },
    { content: '', isCorrect: false, position: 1 },
  ],
};

export default function QuizCreatePage() {
  const { classId } = useParams();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizzes, setQuizzes] = useState<QuizData[]>([INITIAL_QUIZ_VALUE]);
  const [forceRender, setForceRender] = useState(1);
  const mutation = useCreateQuiz();

  const addNewQuiz = () => {
    setQuizzes((prev) => [...prev, INITIAL_QUIZ_VALUE]);
    setCurrentQuizIndex((prev) => prev + 1);
  };

  const removeQuiz = (index: number) => {
    if (quizzes.length === 1) return;
    setQuizzes((prev) => {
      const newQuizzes = [...prev];
      newQuizzes.splice(index, 1);

      if (index === prev.length - 1) {
        setCurrentQuizIndex((prevIndex) => Math.max(0, prevIndex - 1));
      }
      return newQuizzes;
    });
    setForceRender((prev) => prev + 1);
  };

  const handlePreQuiz = () => {
    if (currentQuizIndex === 0) return;
    setCurrentQuizIndex((prev) => prev - 1);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex === quizzes.length - 1) return;
    setCurrentQuizIndex((prev) => prev + 1);
  };

  const handleCreateQuiz = () => {
    const quizzesData = {
      quizzes: quizzes,
    };
    mutation.mutate({ quizData: quizzesData, classId: Number(classId) });
  };

  return (
    <div className="flex flex-col w-full mt-6 mx-6">
      <div className=" flex gap-4 bg-white rounded-base p-4 mb-4">
        <button className="text-weak-md" onClick={handlePreQuiz}>
          이전 문제
        </button>
        <button className="text-weak-md" onClick={handleNextQuiz}>
          다음 문제
        </button>
        <div className="flex-1 flex justify-end text-weak-md">문제 유형: 객관식</div>
      </div>
      <QuizCreateSection
        key={currentQuizIndex + forceRender}
        currentQuizIndex={currentQuizIndex}
        quizData={quizzes[currentQuizIndex]}
        onQuizUpdate={(updatedData: QuizData) => {
          setQuizzes((prev) => {
            const newQuizzes = [...prev];
            newQuizzes[currentQuizIndex] = { ...updatedData, position: currentQuizIndex };
            return newQuizzes;
          });
        }}
      />
      <div className="flex justify-between mt-10 mr-6">
        <div className="flex gap-6">
          <CustomButton
            Icon={PlusIcon}
            type="outline"
            size="md"
            color="primary"
            label="문제 추가하기"
            onClick={addNewQuiz}
          />
          <button
            className="flex items-center min-w-fit h-[44px] px-4 py-2.5 bg-white border-2 border-red-500 text-red-500 rounded-base font-medium leading-none text-md
            disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => removeQuiz(currentQuizIndex)}
            disabled={quizzes.length === 1}
          >
            <PlusIcon className="w-5 h-5 mr-1 transform rotate-45" />
            문제 삭제하기
          </button>
        </div>
        <CustomButton label="퀴즈 발행하기" onClick={handleCreateQuiz} />
      </div>
    </div>
  );
}
