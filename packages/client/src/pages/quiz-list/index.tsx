import DownArrowIcon from '@/shared/assets/icons/down-arrow.svg?react';
import { CustomButton } from '@/shared/ui/buttons';
import Modal from '@/shared/ui/modal';
import { useState } from 'react';
import QuizTitleModal from './ui/QuizTitleModal';
import { useNavigate } from 'react-router-dom';

const useGetQuizList = () => {
  const data = [
    {
      title: 'Quiz 1',
      createdAt: '2021-08-10',
      quizzes: [
        {
          content: 'What is the capital of France?',
          timeLimit: 10,
          choices: [
            { content: 'Paris', isCorrect: true },
            { content: 'London', isCorrect: false },
            { content: 'Berlin', isCorrect: false },
            { content: 'Madrid', isCorrect: false },
          ],
        },
      ],
    },
    {
      title: 'Quiz 2',
      createdAt: '2021-08-11',
      quizzes: [
        {
          content: 'What is the capital of Germany?',
          timeLimit: 10,
          choices: [
            { content: 'Paris', isCorrect: false },
            { content: 'London', isCorrect: false },
            { content: 'Berlin', isCorrect: true },
            { content: 'Madrid', isCorrect: false },
          ],
        },
      ],
    },
  ];
  return { data };
};

export default function QuizList() {
  const { data: quizList } = useGetQuizList();
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(-1);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleSelectQuiz = (index: number) => {
    if (selectedQuizIndex === index) {
      setSelectedQuizIndex(-1);
      return;
    }
    setSelectedQuizIndex(index);
  };
  return (
    <div className="flex flex-col gap-10 w-full mt-6 mr-6">
      {quizList.map((quiz, index) => (
        <div>
          <div
            className={`flex justify-between itemds-center min-w-content h-20 items-center bg-white ${selectedQuizIndex === index ? 'border-secondary' : 'border-border'}  border rounded-base p-6 cursor-pointer`}
            onClick={() => handleSelectQuiz(index)}
          >
            <span>{quiz.title}</span>
            <div className="flex gap-12">
              <CustomButton
                type="full"
                label="퀴즈 시작하기"
                color="secondary"
                onClick={() => navigate('/quiz/wait')}
              />
              <span className="flex justify-center items-center">생성일자: {quiz.createdAt}</span>
              <button type="button" onClick={() => handleSelectQuiz(index)}>
                <DownArrowIcon
                  stroke="#000000"
                  className={selectedQuizIndex === index ? 'rotate-180' : 'rotate-0'}
                />
              </button>
            </div>
          </div>
          {selectedQuizIndex === index && (
            <div
              className={`flex flex-col gap-3 p-6 mt-4 border ${selectedQuizIndex === index ? 'border-secondary' : 'border-border'} rounded-base bg-white`}
            >
              {quiz.quizzes.map((quizData, index) => (
                <span>
                  {index + 1}번 문제: {quizData.content}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="self-end">
        <CustomButton
          type="outline"
          label="퀴즈 만들기"
          color="primary"
          size="md"
          onClick={() => setOpenModal(true)}
        />
      </div>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <QuizTitleModal onClose={() => setOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
}
