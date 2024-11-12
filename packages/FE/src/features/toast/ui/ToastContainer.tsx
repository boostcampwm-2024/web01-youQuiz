import { useToastContainer } from '@/features/toast/hooks/useToastContainer';
import Toast from '@/features/toast/ui/Toast';

const toastPositions = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
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
