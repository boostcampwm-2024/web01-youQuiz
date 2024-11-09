import CloseIcon from '@/shared/assets/icons/close.svg?react';
import ProgressBar from '../progress-bar/ProgressBar';
import { ToggleButton } from '../buttons';

interface ToastProps {
  /** Toast의 타입 (success | warning | error | info) */
  type: 'success' | 'warning' | 'error' | 'info';
  /** Toast에 표시할 문구 */
  label: string;
  /** Toast가 표시될 시간 (5 | 10 | 15 | 20 | 30) */
  time: 5 | 10 | 15 | 20 | 30;
}

const getLogo = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return (
        <ToggleButton
          type="check"
          isClickable={false}
          isActive={true}
          onClick={() => console.log('success')}
          size="small"
        />
      );
    case 'warning':
      return;
    case 'error':
      return (
        <ToggleButton
          type="question"
          isClickable={false}
          isActive={true}
          onClick={() => console.log('error')}
          size="small"
          color="error"
        />
      );
    case 'info':
      return;
  }
};
export default function Toast({ type = 'success', label, time }: ToastProps) {
  const logo = getLogo(type);
  return (
    <div className="relative flex flex-col justify-center w-[296px] h-16 rounded-base bg-white border overflow-hidden group ">
      <div className="flex gap-4 px-4 item-center">
        <div className="">{logo}</div>
        <p className="flex justify-center items-center text-weak-md">{label}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-[296px]">
        <ProgressBar
          time={time}
          type={type}
          barShape="rounded"
          pauseOnHover={true}
          handleAnimationEnd={() => console.log('토스트 닫기')}
        />
      </div>
      <CloseIcon className="absolute top-3 right-3 cursor-pointer" />
    </div>
  );
}
