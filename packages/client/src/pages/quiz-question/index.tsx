import { useState } from 'react';
import QuizCard from './ui/quiz-card';
import ArrowUpCircleIcon from '@/shared/assets/icons/arrow-up-circle.svg?react';
import { scrollToPosition } from '@/shared/utils/scrollToPosition';
import { CustomButton } from '@/shared/ui/buttons';
import { useNavigate } from 'react-router-dom';

// TODO: model
export type QuizData = {
  quizIndex: number;
  title: string;
  choices: string[];
  guestChoice: number;
  isCorrect: boolean;
};

const QUIZ_CARD_HEIGHT = 160;
const QUIZ_CARD_GAP = 24;

const QUESTION_INPUT_HEIGHT = 60;

// TODO: API 연동 후 QUIZ_NAME을 API로 받아오도록 수정
const QUIZ_NAME = 'Quiz Name';
const quizData: QuizData[] = [
  {
    quizIndex: 0,
    title: '임시 퀴즈 문제1',
    choices: ['천마총', '왕릉', '석굴암', '불국사'],
    guestChoice: 3,
    isCorrect: false,
  },
  {
    quizIndex: 1,
    title: '임시 퀴즈 문제2',
    choices: ['천마총', '왕릉', '석굴암', '불국사'],
    guestChoice: 2,
    isCorrect: true,
  },
];

export default function QuizQuestion() {
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const { scrollTo } = scrollToPosition();
  const navigate = useNavigate();

  const handleQuizIndexClick = (index: number) => {
    const scrollPosition = index * (QUIZ_CARD_HEIGHT + QUIZ_CARD_GAP);
    // 스크롤 이동 시 예쁘게 보이도록 추가 높이를 줌
    const additionalHeight =
      selectedQuiz < index ? QUESTION_INPUT_HEIGHT - 5 : QUESTION_INPUT_HEIGHT - 10;
    scrollTo(scrollPosition + additionalHeight);
    setSelectedQuiz(index);
  };

  const handleQuizCardClick = (index: number) => {
    setSelectedQuiz(index);
  };

  const handleQuestionSubmit = () => {
    // TODO: API 연동 후 질문 데이터 전송
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuestionSubmit();
    }
  };

  return (
    <div className="h-screen bg-transparent">
      <header className="fixed flex justify-between items-center w-screen h-[78px] mx-auto border-b-2 px-8 py-4 bg-white">
        {QUIZ_NAME}
      </header>
      <div className="flex">
        <div className="fixed top-[78px] flex flex-col gap-12 w-[180px] h-[calc(100vh-78px)] py-14 bg-white overflow-y-scroll">
          {quizData.map((quiz, index) => (
            <button
              key={quiz.title}
              type="button"
              className={`bg-transparent border-none ${selectedQuiz === index ? 'text-primary' : 'text-border'}`}
              onClick={() => handleQuizIndexClick(index)}
            >
              Quiz{index + 1}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-6 px-[100px] py-16 ml-[180px] mt-[78px]">
          {quizData.map((quiz, index) => (
            <div key={quiz.title} className="flex flex-col gap-6">
              <QuizCard
                isSelected={selectedQuiz === index}
                quizData={quizData[index]}
                onClick={() => handleQuizCardClick(index)}
              />
              {selectedQuiz === index && (
                <div className="flex items-center gap-6 w-[1250px] h-16 border-border border-2 rounded-base py-5 px-8 bg-white ">
                  <input
                    type="text"
                    placeholder="문제에 대한 질문을 입력하세요"
                    className="w-full font-bold focus:outline-none"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={handleQuestionSubmit}>
                    <ArrowUpCircleIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="self-end">
            <CustomButton
              type="full"
              color="primary"
              label="제출하기"
              size="md"
              onClick={() => navigate('/guest/questions')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
