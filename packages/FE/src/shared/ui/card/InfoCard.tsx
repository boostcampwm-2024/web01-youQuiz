import { useState } from 'react';
import DownArrow from '@/shared/assets/icons/down-arrow.svg?react';

type InfoItem = {
  title: string;
  onClick: () => void;
};

interface InfoCardProps {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  infoList: InfoItem[];
  isExpandable: boolean;
}

export default function InfoCard({ Icon, title, infoList, isExpandable }: InfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-5 px-4 h-20 w-[255px] rounded-base bg-white border-[1px] border-border">
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-secondary">
          <Icon stroke="#ffffff" />
        </div>
        <span className="w-24">{title}</span>
        <span>{infoList.length}Q</span>
        {isExpandable && (
          <button type="button" onClick={handleExpand}>
            <DownArrow stroke="#525252" className={`${isExpanded && '-scale-y-100'}`} />
          </button>
        )}
      </div>
      {isExpandable && isExpanded && (
        <div className="flex flex-col items-center gap-3 py-2 rounded-base bg-white border-[1px] border-border w-[255px] h-full">
          {infoList.map((info) => (
            <div
              key={info.title}
              onClick={info.onClick}
              className="flex justify-center items-center text-md font-medium border-b-[1px] border-border h-8 w-3/4 cursor-pointer"
            >
              {info.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
