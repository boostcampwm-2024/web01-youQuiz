import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}
export default function Modal({ children, onClose }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={handleBackdropClick}>
      <div className="flex justify-center items-center h-full">{children}</div>
    </div>,
    document.body,
  );
}
