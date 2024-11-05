import React from 'react';

interface IconTextButtonProps {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
  isActive: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function IconTextButton({ Icon, text, isActive, onClick }: IconTextButtonProps) {
  return (
    <button className="flex flex-col gap-3 justify-center items-center" onClick={onClick}>
      <div
        className={`flex justify-center items-center ${isActive ? 'w-16 h-16 bg-weak-primary rounded-full' : 'w-8 h-8 bg-transparent'}`}
      >
        <Icon stroke={`${isActive ? '#053cd5' : '#525252'}`} />
      </div>
      <span className={`font-medium text-md ${isActive ? 'text-primary' : 'text-textWeak'}`}>
        {text}
      </span>
    </button>
  );
}
