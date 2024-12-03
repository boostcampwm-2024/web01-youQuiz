import { useMutation } from '@tanstack/react-query';
import { createQuiz } from '../api/quizzes';
import { QuizData } from '@/pages/quiz-create';
import { toastController } from '@/features/toast/model/toastController';
import { useNavigate } from 'react-router-dom';

interface Quizzes {
  quizzes: QuizData[];
}

interface CreateQuizParams {
  quizData: Quizzes;
  classId: number;
}

export const useCreateQuiz = () => {
  const toast = toastController();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['quiz'],
    mutationFn: ({ quizData, classId }: CreateQuizParams) => createQuiz(quizData, classId),
    onSuccess: () => {
      navigate('/quiz-list');
      toast.success('퀴즈가 생성되었습니다.');
    },
    onError: () => toast.error('퀴즈 생성에 실패했습니다.'),
  });
};
