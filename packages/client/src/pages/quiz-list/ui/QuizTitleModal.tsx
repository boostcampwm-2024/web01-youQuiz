import { useNavigate } from 'react-router-dom';

interface QuizTitleModalProps {
  onClose: () => void;
}

export default function QuizTitleModal({ onClose }: QuizTitleModalProps) {
  const navigate = useNavigate();
  const handleConfirmClick = () => {
    // TODO: 서버로 퀴즈 제목 전송
    onClose();
    navigate('/quiz/create');
  };
  return (
    <div
      className="w-[480px] h-[172px] flex flex-col items-center justify-center gap-6 p-5 bg-white rounded-lg border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        placeholder="퀴즈 제목을 입력하세요"
        className="w-full h-10 px-3 rounded-lg border border-gray-200"
      />
      <button className="h-10 px-6 bg-primary text-white rounded-lg" onClick={handleConfirmClick}>
        확인
      </button>
    </div>
  );
}
