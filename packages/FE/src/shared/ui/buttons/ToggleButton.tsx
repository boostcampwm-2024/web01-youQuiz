import CheckIcon from '@/shared/assets/icons/check.svg?react';
import CheckBoxIcon from '@/shared/assets/icons/check-box.svg?react';
import QuestionIcon from '@/shared/assets/icons/question.svg?react';

type ToggleButtonType = 'check' | 'question' | 'checkBox';
type ToggleButtonSize = 'small' | 'medium' | 'large';
type ToggleButtonColor = 'success' | 'warning' | 'error' | 'info';

interface ToggleButtonProps {
  /** 토글 버튼 타입 (check, question, checkbox) */
  type: ToggleButtonType;
  /**클릭이 가능한 상태 여부 */
  isClickable: boolean;
  /** 버튼 활성화 여부 */
  isActive: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
  /** 버튼 사이즈 (small, medium, large) */
  size?: ToggleButtonSize;
  /** 색상 */
  color?: ToggleButtonColor;
}

const getIcon = (type: ToggleButtonType, isActive: boolean, iconSize: string) => {
  switch (type) {
    case 'check':
      return <CheckIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} className={iconSize} />;
    case 'question':
      return <QuestionIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} className={iconSize} />;
    case 'checkBox':
      return <CheckBoxIcon stroke={`${isActive ? '#ffffff' : '#525252'}`} className={iconSize} />;
  }
};

const iconSizees = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8',
};

const buttonSizees = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-10 h-10',
};

const colors = {
  success: 'bg-secondary',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export default function ToggleButton({
  type,
  isClickable,
  isActive,
  onClick,
  size = 'medium',
  color = 'success',
}: ToggleButtonProps) {
  const iconSize = iconSizees[size];
  const buttonSize = buttonSizees[size];
  const backgroundColor = colors[color];
  const icon = getIcon(type, isActive, iconSize);

  return (
    <div>
      {isClickable ? (
        <button
          className={`${buttonSize} border rounded-full ${isActive ? 'bg-secondary border-none' : 'bg-transparent border-[1.5px] border-textWeak'} flex items-center justify-center`}
          onClick={onClick}
        >
          {icon}
        </button>
      ) : (
        <div
          className={`flex items-center justify-center ${buttonSize} ${backgroundColor} border rounded-full `}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
