import { useState } from 'react';

import { CustomButton } from '@/shared/ui/buttons';
import PlusIcon from '@/shared/assets/icons/plus.svg?react';
import QuizCreateSection from './ui/QuizCreateSection';
import { useNavigate, useParams } from 'react-router-dom';
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
  const mutation = useCreateQuiz();
  const navigate = useNavigate();

  const addNewQuiz = () => {
    setQuizzes((prev) => [...prev, INITIAL_QUIZ_VALUE]);
    setCurrentQuizIndex((prev) => prev + 1);
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
    mutation.mutate(
      { quizData: quizzesData, classId: Number(classId) },
      {
        onSuccess: () => {
          navigate('/quiz-list');
        },
      },
    );
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
        <div className="flex-1 flex justify-end text-weak-md">문제 유형</div>
      </div>
      <QuizCreateSection
        key={currentQuizIndex}
        currentQuizIndex={currentQuizIndex}
        quizData={quizzes[currentQuizIndex]}
        onQuizUpdate={(updatedData: QuizData) => {
          setQuizzes((prev) => {
            const newQuizzes = [...prev];
            newQuizzes[currentQuizIndex] = updatedData;
            return newQuizzes;
          });
        }}
      />
      <div className="self-start mt-10">
        <CustomButton
          Icon={PlusIcon}
          type="outline"
          size="md"
          color="primary"
          label="문제 추가하기"
          onClick={() => {
            addNewQuiz();
            console.log(quizzes);
            console.log(currentQuizIndex);
          }}
        />
      </div>
      <div className="self-end mr-6">
        <CustomButton label="퀴즈 발행하기" onClick={handleCreateQuiz} />
      </div>
    </div>
  );
}
