import { useState } from 'react';

import Quiz from './ui/Quiz';
import { useNavigate } from 'react-router-dom';

interface Quizes {
  title: string;
  choices: {
    content: string;
    isAnswer: boolean;
  }[];
}

const mockQuizData: Quizes[] = [
  {
    title: '임시 퀴즈 문제1',
    choices: [
      {
        content: '천마총',
        isAnswer: false,
      },
      {
        content: '왕릉',
        isAnswer: false,
      },
      {
        content: '석굴암',
        isAnswer: true,
      },
      {
        content: '불국사',
        isAnswer: false,
      },
    ],
  },
  {
    title: '임시 퀴즈 문제2',
    choices: [
      {
        content: '천마총',
        isAnswer: false,
      },
      {
        content: '왕릉',
        isAnswer: false,
      },
      {
        content: '석굴암',
        isAnswer: true,
      },
      {
        content: '불국사',
        isAnswer: false,
      },
    ],
  },
];

export default function QuizSession() {
  //TODO: 퀴즈 정보는 React-query를 활용해서 브라우저 캐시에서 가져온다.

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const navigate = useNavigate();

  const handleAnimationEnd = () => {
    // TODO: 타이머 종료 시 다음 퀴즈 페이지로 이동하는 이벤트 emit
    setCurrentQuizIndex((pre) => pre + 1);
    if (currentQuizIndex === mockQuizData.length - 1) {
      // TODO: Host 여부에 따라 페이지 변경
      // HOST - navigate('/questions)
      navigate('/quiz/question');
    }
  };

  return (
    <>
      <Quiz
        key={currentQuizIndex}
        quizData={mockQuizData[currentQuizIndex]}
        handleAnimationEnd={handleAnimationEnd}
      />
    </>
  );
}
