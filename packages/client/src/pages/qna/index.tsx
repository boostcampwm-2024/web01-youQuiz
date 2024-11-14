import { useState } from 'react';
import QuestionCard from './ui/QuestionCard';
import CommentCard from './ui/CommentCard';

// TODO: API로 받아온 데이터로 대체
const questions = [
  {
    index: 1,
    description: 'What is the capital of France?',
    comments: [
      {
        content: 'I think it is Paris',
        isOrganizer: true,
      },
      {
        content: 'I think it is London  ',
        isOrganizer: false,
      },
      {
        content: 'I think it is Berlin',
        isOrganizer: false,
      },
    ],
  },
  {
    index: 1,
    description: 'What is the capital of USA?',
    comments: [
      {
        content: 'I think it is Washington DC',
        isOrganizer: false,
      },
      {
        content: 'I think it is New York',
        isOrganizer: true,
      },
      {
        content: 'I think it is Los Angeles',
        isOrganizer: false,
      },
    ],
  },
  {
    index: 2,
    description: 'What is the capital of Germany?',
    comments: [
      {
        content: 'I think it is Berlin',
        isOrganizer: true,
      },
      {
        content: 'I think it is Munich',
        isOrganizer: false,
      },
      {
        content: 'I think it is Frankfurt',
        isOrganizer: false,
      },
    ],
  },
  {
    index: 3,
    description: 'What is the capital of Italy?',
    comments: [
      {
        content: 'I think it is Rome',
        isOrganizer: true,
      },
      {
        content: 'I think it is Milan',
        isOrganizer: false,
      },
      {
        content: 'I think it is Venice',
        isOrganizer: false,
      },
    ],
  },
];

const questionIndexes = [...new Set(questions.map((question) => question.index))];

export default function QnA() {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  // 처음 선택된 질문이 없으므로 -1로 초기화
  const [selectedComment, setSelectedComment] = useState(-1);
  const [commentValue, setCommentValue] = useState('');

  return (
    <div className="px-5 py-11">
      <div className="flex gap-5 mb-5">
        <button
          className={`w-20 h-8 mr-5 rounded-base ${selectedQuestion === 0 ? 'bg-primary text-white' : 'bg-weak-primary text-primary'} `}
          onClick={() => setSelectedQuestion(0)}
        >
          전체문제
        </button>
        {questionIndexes.map((index) => (
          <button
            className={`w-14 h-8 rounded-base ${selectedQuestion === index ? 'bg-primary text-white' : 'bg-weak-primary text-primary'}`}
            onClick={() => setSelectedQuestion(index)}
          >
            #Q{index}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-7">
        {questions
          .filter((question) => {
            if (selectedQuestion === 0) return true;
            return question.index === selectedQuestion;
          })
          .map((question, index) => (
            <div>
              <QuestionCard
                isSelected={selectedComment === index}
                question={question}
                setSelectedComment={setSelectedComment}
                index={index}
              />
              {selectedComment === index && (
                <CommentCard
                  comments={question.comments}
                  commentValue={commentValue}
                  setCommentValue={setCommentValue}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
