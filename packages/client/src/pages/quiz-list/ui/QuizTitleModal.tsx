import { toastController } from '@/features/toast/model/toastController';
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
  const toast = toastController();
  const { mutate } = useCreateClass();

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirmClick();
    }
  };

  const handleConfirmClick = () => {
    if (!title || !description) {
      toast.warning('제목과 설명을 입력해주세요');
      return;
    }
    mutate(
      { title, description },
      {
        onSuccess: (data) => {
          onClose();
          navigate(`/quiz/create/${data.id}`);
        },
      },
    );
  };
  return (
    <div
      className="w-[480px] h-[250px] flex flex-col items-center justify-center gap-4 p-5 bg-white rounded-lg border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <h1 className="text-xl font-bold">클래스 정보를 입력해주세요</h1>
      <input
        type="text"
        placeholder="클래스 제목을 입력하세요"
        className="w-full h-10 p-3 rounded-lg border border-gray-200"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        onKeyDown={handleEnterKeyPress}
      />
      <input
        type="text"
        placeholder="클래스 설명을 입력하세요"
        className="w-full h-10 p-3 rounded-lg border border-gray-200"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        onKeyDown={handleEnterKeyPress}
      />
      <button
        className="w-36 h-10 px-6 bg-primary text-white rounded-lg"
        onClick={handleConfirmClick}
      >
        확인
      </button>
    </div>
  );
}
