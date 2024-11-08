import { useState, useRef } from 'react';

import InfoCard from '@/shared/ui/card/InfoCard';
import QuestionIcon from '@/shared/assets/icons/question.svg?react';
import CheckboxIcon from '@/shared/assets/icons/check-box.svg?react';
import LeftArrowIcon from '@/shared/assets/icons/chevrons-left.svg?react';
import RightArrowIcon from '@/shared/assets/icons/chevrons-right.svg?react';

interface SideBarProps {
  /**클래스 명을 입력합니다. */
  title: string;
}

export default function SideBar({ title }: SideBarProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const sideBarRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={sideBarRef}
      className={`px-6 transition-transform duration-300 ${isSideBarOpen ? 'translate-x-0' : '-translate-x-3/4'}`}
      onTransitionEnd={() => sideBarRef.current?.classList.toggle('invisible', !isSideBarOpen)}
    >
      <p className="flex items-center justify-between gap-2 px-4 py-6">
        <span className="text-bold-xl">{title}</span>
        {isSideBarOpen ? (
          <LeftArrowIcon
            className="cursor-pointer"
            onClick={() => setIsSideBarOpen((prev) => !prev)}
          />
        ) : (
          <RightArrowIcon
            className="cursor-pointer visible"
            onClick={() => setIsSideBarOpen((prev) => !prev)}
          />
        )}
      </p>
      <div className="flex flex-col gap-4">
        <InfoCard Icon={CheckboxIcon} title="Q&A" infoList={[]} isExpandable={false} />
        <InfoCard Icon={QuestionIcon} title="Quiz" infoList={[]} isExpandable={true} />
      </div>
    </div>
  );
}
