import { useState, useRef } from 'react';

import CustomButton from '@/shared/ui/buttons/CustomButton';
import InputBox from '@/shared/ui/input-box/InputBox';
import AnswerBox from './AnswerBox';
import TimeSelectBox from './TimeSelectBox';
import PlusIcon from '@/shared/assets/icons/plus.svg?react';

interface SelectOption {
  option: string;
  isAnswer: boolean;
}

export default function QuizCreateSection() {
  const [quizTitle, setQuizTitle] = useState('');
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([
    { option: '', isAnswer: false },
    { option: '', isAnswer: false },
  ]);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [timer, setTimer] = useState(20);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const toggleAnswer = (index: number) => {
    setSelectOptions((prev) => {
      const newOptions = prev.map((option, i) =>
        i === index ? { ...option, isAnswer: !option.isAnswer } : option,
      );
      return newOptions;
    });
  };

  const setOption = (index: number, value: string) => {
    setSelectOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index].option = value;
      return newOptions;
    });
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < selectOptions.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        setSelectOptions((prev) => [...prev, { option: '', isAnswer: false }]);
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  return (
    <section className="flex-1 m-6">
      <article className="min-w-content min-h-[732px] flex flex-col gap-1 items-center bg-white rounded-base p-6">
        <p className="self-start relative">
          <span className="text-weak-md mr-3">N번 퀴즈</span>
          <span
            className="text-weak-sm cursor-pointer"
            onClick={() => setShowTimeSelect(!showTimeSelect)}
          >
            {timer === 0 ? '제한없음' : `${timer}초`}
          </span>
          {showTimeSelect && (
            <TimeSelectBox setTime={setTimer} setShowTimeSelect={setShowTimeSelect} />
          )}
        </p>
        <p className="w-full">
          <InputBox
            placeholder="문제를 입력해주세요"
            type="box"
            onSubmit={(value) => setQuizTitle(value)}
          />
        </p>
        <div className="flex flex-col gap-4 w-full mt-10">
          {selectOptions.map((_, index) => (
            <AnswerBox
              key={index}
              selected={selectOptions[index].isAnswer}
              answerSetter={() => toggleAnswer(index)}
              optionSetter={(value: string) => setOption(index, value)}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onKeyDown={(e) => handleKeyDown(index, e)}
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
              setSelectOptions((prev) => [...prev, { option: '', isAnswer: false }]);
            }}
          />
        </div>
        <div className="self-start mt-10">
          <CustomButton
            Icon={PlusIcon}
            type="outline"
            size="md"
            color="primary"
            label="문제 추가하기"
            onClick={() => {}}
          />
        </div>
      </article>

      <CustomButton
        label="퀴즈 발행하기"
        onClick={() => {
          console.log('퀴즈 발행하기');
        }}
      />
    </section>
  );
}
