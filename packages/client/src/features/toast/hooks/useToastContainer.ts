import { useState, useEffect } from 'react';
import { EventManager, ToastEvent } from '@/shared/libs/EventManager';
import { ToastProps } from '../types';

export const useToastContainer = () => {
  const [toastList, setToastList] = useState<ToastProps[]>([]);

  useEffect(() => {
    EventManager.on(ToastEvent.ADD, (toast: ToastProps) => {
      setToastList((prev) => [...prev, toast]);
    });
    EventManager.on(ToastEvent.DELETE, (toastId: number) => {
      setToastList((prev) => prev.filter((toast) => toast.toastId !== toastId));
    });

    return () => {
      EventManager.off(ToastEvent.ADD);
      EventManager.off(ToastEvent.DELETE);
    };
  }, []);

  return { toastList };
};
