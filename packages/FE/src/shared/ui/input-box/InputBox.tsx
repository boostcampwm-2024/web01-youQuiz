import { useState } from 'react';
import SubmitIcon from '@/shared/assets/icons/arrow-up-circle.svg?react';

interface InputBoxProps {
  /** placeholder 텍스트 */
  placeholder: string;
  /** 제출 버튼 표시 여부 */
  button?: boolean;
  /** 인풋 박스 타입 */
  type?: 'box' | 'underline';
  /** 제출 함수: 입력한 값을 인자로 받습니다. */
  onSubmit: (value: string) => void;
}

const inputBoxStyles = {
  box: 'min-w-96 h-10 border-2 border-weak rounded-base p-4 text-md-md',
  underline:
    'min-w-96 h-10 border-b-2 border-weak p-4 text-md-md focus:border-b-primary focus:outline-none',
};

export default function InputBox({ placeholder, button, type = 'box', onSubmit }: InputBoxProps) {
  const [value, setValue] = useState('');
  const classes = inputBoxStyles[type];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(value);
    }
  };
  return (
    <div className="relative">
      <input
        type="text"
        className={classes}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {button && (
        <SubmitIcon
          className="absolute top-1.5 right-3 cursor-pointer"
          onClick={() => {
            onSubmit(value);
          }}
        />
      )}
    </div>
  );
}
