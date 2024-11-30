import { useNavigate } from 'react-router-dom';
import LeftArrow from '@/shared/assets/icons/left-arrow.svg?react';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBackBtn = () => {
    if (window.location.pathname === '/quiz-list') {
      navigate('/');
    } else {
      history.back();
    }
  };
  return (
    <button
      className="w-10 h-10 border rounded-full border-none bg-weak flex items-center justify-center"
      onClick={handleBackBtn}
    >
      <LeftArrow className="w-6 h-6" />
    </button>
  );
}
