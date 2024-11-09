import { useState } from 'react';
import ToggleButton from '@/shared/ui/buttons/ToggleButton';

interface QuizFormProps {
  options: string[];
  selectedOptions: number[];
  onToggle: (index: number) => void;
}

export default function QuizForm({ options, selectedOptions, onToggle }: QuizFormProps) {
  return (
    <div className="flex flex-col bg-white rounded-base w-2/4 min-h-[432px]">
      <p className="text-md-xl text-center">문제 준비중입니다.</p>
      <p className="flex flex-col justify-center items-center gap-6 pt-10">
        {options.map((option, index) => (
          <div key={option + index} className="flex items-center gap-6">
            <ToggleButton
              type="check"
              isClickable
              isActive={selectedOptions.includes(index)}
              onClick={() => onToggle(index)}
              size="small"
            />
            <span className="text-md-md border-b">{option}</span>
          </div>
        ))}
      </p>
    </div>
  );
}
