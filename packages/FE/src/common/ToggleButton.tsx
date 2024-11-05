import CheckIcon from '../assets/icons/check.svg?react';
import CheckBoxIcon from '../assets/icons/check-box.svg?react';
import QuestionIcon from '../assets/icons/question.svg?react';

type ToggleButtonType = 'check' | 'question' | 'checkBox';
type ToggleButtonSize = 'small' | 'medium' | 'large';

interface ToggleButtonProps {
  /** 토글 버튼 타입 (check, question, checkbox) */
  type: ToggleButtonType;
  /** 활성화 여부 */
  isActive: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
  // TODO: 다양한 사이즈 지원
  size?: ToggleButtonSize;
}

export default function ToggleButton({ type, isActive, onClick }: ToggleButtonProps) {
  const getIcon = () => {
    switch (type) {
      case 'check':
        return <CheckIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} />;
      case 'question':
        return <QuestionIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} />;
      case 'checkBox':
        return <CheckBoxIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} />;
    }
  };

  return (
    <button
      className={`w-8 h-8 border rounded-full ${isActive ? 'bg-secondary border-none' : 'bg-transparent border-[1.5px] border-textWeak'} flex items-center justify-center`}
      onClick={onClick}
    >
      {getIcon()}
    </button>
  );
}
