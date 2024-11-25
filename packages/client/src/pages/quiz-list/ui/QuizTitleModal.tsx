import { useCreateClass } from '@/shared/hooks/classes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizTitleModalProps {
  onClose: () => void;
}

export default function QuizTitleModal({ onClose }: QuizTitleModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();
  const mutation = useCreateClass();

  const handleConfirmClick = () => {
    // TODO: 서버로 퀴즈 제목 전송
    mutation.mutate(
      { title, description },
      {
        onSuccess: () => {
          onClose();
          navigate('/quiz/create');
        },
      },
    );
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
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        type="text"
        placeholder="퀴즈 설명을 입력하세요"
        className="w-full h-10 px-3 rounded-lg border border-gray-200"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <button className="h-10 px-6 bg-primary text-white rounded-lg" onClick={handleConfirmClick}>
        확인
      </button>
    </div>
  );
}
