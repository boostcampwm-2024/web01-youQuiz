import React from 'react';

interface CustomButtonProps {
  /** 버튼 타입 */
  type?: 'full' | 'outline';
  /** 버튼 아이콘 */
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  /** 버튼 색상 */
  color?: 'primary' | 'secondary' | 'light';
  /** 버튼 사이즈 */
  size?: 'sm' | 'md';
  /** 버튼 라벨 */
  label: string;
  /** 버튼 클릭 이벤트 */
  onClick?: () => void;
}

const buttonStyles = {
  sm: {
    primary: {
      full: 'h-[24px] px-2.5 py-1.5 bg-primary text-white rounded-lg',
      outline: 'h-[24px] px-2.5 py-1.5 bg-white border-2 border-primary text-primary rounded-lg ',
    },
    secondary: {
      full: 'h-[24px] px-2.5 py-1.5 bg-secondary text-white rounded-lg',
      outline:
        'h-[24px] px-2.5 py-1.5 bg-white border-2 border-secondary text-secondary rounded-lg',
    },
    light: {
      full: 'h-[24px] px-2.5 py-1.5 bg-blue-100 text-primary rounded-lg',
      outline: 'h-[24px] px-2.5 py-1.5 bg-white border-2 border-blue-100 text-blue-100 rounded-lg',
    },
  },
  md: {
    primary: {
      full: 'h-[44px] px-4 py-2.5 bg-primary text-white rounded-base',
      outline: 'h-[44px] px-4 py-2.5 bg-white border-2 border-primary text-primary rounded-base',
    },
    secondary: {
      full: 'h-[44px] px-4 py-2.5 bg-secondary text-white rounded-base',
      outline:
        'h-[44px] px-4 py-2.5 bg-white border-2 border-secondary text-secondary rounded-base',
    },
    light: {
      full: 'h-[44px] px-4 py-2.5 bg-blue-100 text-primary rounded-base',
      outline: 'h-[44px] px-4 py-2.5 bg-white border-2 border-blue-100 text-blue-100 rounded-base',
    },
  },
};

export default function CustomButton({
  type = 'full',
  Icon,
  label,
  size = 'md',
  color = 'primary',
  onClick,
}: CustomButtonProps) {
  const classes = buttonStyles[size][color][type];

  return (
    <button onClick={onClick} className={`flex items-center ${classes}`}>
      {Icon && <Icon className="w-5 h-5 mr-1" />}
      <span
        className={`flex items-center font-medium leading-none ${
          size === 'sm' ? 'text-sm font-bold' : 'text-md'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
