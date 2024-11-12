import CloseIcon from '@/shared/assets/icons/close.svg?react';
import ProgressBar from '@/shared/ui/progress-bar/ProgressBar';
import { ToggleButton } from '@/shared/ui/buttons';
import { ToastEvent } from '@/shared/libs/EventManager';
import { EventManager } from '@/shared/libs/EventManager';
import { useRef } from 'react';
import { ToastProps } from '../types';

const getLogo = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return <ToggleButton type="check" isClickable={false} isActive={true} size="small" />;
    case 'warning':
      return (
        <ToggleButton
          type="warning"
          isClickable={false}
          isActive={true}
          size="large"
          color="transparent"
        />
      );
    case 'error':
      return (
        <ToggleButton
          type="question"
          isClickable={false}
          isActive={true}
          size="small"
          color="error"
        />
      );
    case 'info':
      return (
        <ToggleButton
          type="info"
          isClickable={false}
          isActive={true}
          size="medium"
          color="transparent"
        />
      );
  }
};
export default function Toast({ toastId, type = 'success', label, time = 5 }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const handleToastClose = () => {
    toastRef.current?.classList.add('animate-slide-out');
    setTimeout(() => {
      EventManager.emit(ToastEvent.DELETE, toastId);
    }, time * 100);
  };

  const logo = getLogo(type);

  return (
    <div
      className="relative flex flex-col justify-center w-[296px] h-16 rounded-base bg-white border overflow-hidden group"
      ref={toastRef}
    >
      <div className="flex gap-4 px-4 item-center">
        {logo}
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
