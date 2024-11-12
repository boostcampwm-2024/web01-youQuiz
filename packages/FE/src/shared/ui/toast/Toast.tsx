import CloseIcon from '@/shared/assets/icons/close.svg?react';
import ProgressBar from '../progress-bar/ProgressBar';
import { ToggleButton } from '../buttons';
import { ToastEvent } from '@/shared/libs/EventManager';
import { EventManager } from '@/shared/libs/EventManager';
import { useRef } from 'react';
interface ToastProps {
  /** Toast의 고유 id */
  toastId: number;
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
export default function Toast({ toastId, type = 'success', label, time = 5 }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const handleToastClose = () => {
    EventManager.emit(ToastEvent.DELETE, toastId);
    toastRef.current?.classList.add('animate-fade-out');
  };

  const logo = getLogo(type);

  return (
    <div
      className="relative flex flex-col justify-center w-[296px] h-16 rounded-base bg-white border overflow-hidden group"
      ref={toastRef}
    >
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
          handleAnimationEnd={handleToastClose}
        />
      </div>
      <CloseIcon className="absolute top-3 right-3 cursor-pointer" onClick={handleToastClose} />
    </div>
  );
}
