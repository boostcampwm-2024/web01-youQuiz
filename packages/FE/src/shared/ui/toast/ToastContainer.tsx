import Toast from './Toast';
import { useToastContainer } from '@/shared/hooks/useToastContainer';

const toastPositions = {
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
};

export default function ToastContainer({ position }: { position: keyof typeof toastPositions }) {
  const { toastList } = useToastContainer();

  return (
    <div
      className={`fixed flex flex-col items-center justify-center gap-4 ${toastPositions[position]} z-50`}
    >
      {toastList.map((toast) => (
        <Toast key={toast.toastId} {...toast} />
      ))}
    </div>
  );
}
