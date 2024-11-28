import { useState, useRef } from 'react';

import CustomButton from '@/shared/ui/buttons/CustomButton';
import InputBox from '@/shared/ui/input-box/InputBox';
import AnswerBox from './AnswerBox';
import TimeSelectBox from './TimeSelectBox';
import PlusIcon from '@/shared/assets/icons/plus.svg?react';

import { QuizData } from '../index';

interface QuizCreateSectionProps {
  quizData: QuizData;
  currentQuizIndex: number;
  onQuizUpdate: (updatedData: QuizData) => void;
}

export default function QuizCreateSection({
  quizData,
  currentQuizIndex,
  onQuizUpdate,
}: QuizCreateSectionProps) {
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const updateChoice = (index: number, updates: Partial<(typeof quizData.choices)[0]>) => {
    const updatedChoices = quizData.choices.map((choice, i) =>
      i === index ? { ...choice, ...updates, position: index } : choice,
    );
    onQuizUpdate({
      ...quizData,
      choices: updatedChoices,
    });
  };

  return (
    <section>
      <article className="min-w-content min-h-[532px] flex flex-col gap-1 items-center bg-white rounded-base p-6">
        <p className="self-start relative">
          <span className="text-weak-md mr-3">{`${currentQuizIndex + 1}번 퀴즈`}</span>
          <span
            className="text-weak-sm cursor-pointer"
            onClick={() => setShowTimeSelect(!showTimeSelect)}
          >
            {`${quizData.timeLimit}초`}
          </span>
          {showTimeSelect && (
            <TimeSelectBox
              setTime={(time: number) => onQuizUpdate({ ...quizData, timeLimit: time })}
              setShowTimeSelect={setShowTimeSelect}
            />
          )}
        </p>
        <p className="w-full">
          <InputBox
            placeholder="문제를 입력해주세요"
            type="box"
            onSubmit={(value) => onQuizUpdate({ ...quizData, content: value })}
            initialValue={quizData.content}
          />
        </p>
        <div className="flex flex-col gap-4 w-full mt-10">
          {quizData.choices.map((choice, index) => (
            <AnswerBox
              key={index}
              selected={choice.isCorrect}
              answerSetter={() => updateChoice(index, { isCorrect: !choice.isCorrect })}
              optionSetter={(value: string) => {
                updateChoice(index, { content: value });
              }}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onKeyDown={(e) => {
                handleKeyDown(index, e);
              }}
              value={choice.content}
            />
          ))}
        </div>
        <div className="self-start mt-4">
          <CustomButton
            Icon={PlusIcon}
            type="outline"
            size="md"
            color="secondary"
            label="답안 추가하기"
            onClick={() => {
              onQuizUpdate({
                ...quizData,
                choices: [...quizData.choices, { content: '', isCorrect: false, position: 0 }],
              });
            }}
          />
        </div>
      </article>
    </section>
  );
}
