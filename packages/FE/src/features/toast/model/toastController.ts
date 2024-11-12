import { EventManager } from '@/shared/libs/EventManager';

import { ToastEvent } from '@/shared/libs/EventManager';
import { ToastTime } from '../types';

export const toastController = () => {
  let toastId = 0;

  const toast = {
    success: (label: string, time: ToastTime = 5) => {
      EventManager.emit(ToastEvent.ADD, { toastId: toastId++, type: 'success', label, time });
    },
    warning: (label: string, time: ToastTime = 5) => {
      EventManager.emit(ToastEvent.ADD, { toastId: toastId++, type: 'warning', label, time });
    },
    info: (label: string, time: ToastTime = 5) => {
      EventManager.emit(ToastEvent.ADD, { toastId: toastId++, type: 'info', label, time });
    },
    error: (label: string, time: ToastTime = 5) => {
      EventManager.emit(ToastEvent.ADD, { toastId: toastId++, type: 'error', label, time });
    },
  };

  return toast;
};
