import { QuizData } from '@/pages/quiz-create';
import { apiClient } from '..';

interface Quizzes {
  quizzes: QuizData[];
}

export const getQuiz = async (classId: number): Promise<QuizData[]> => {
  return apiClient.get(`/classes/${classId}/quizzes`);
};

export const createQuiz = async (quizData: Quizzes, classId: number): Promise<void> => {
  return apiClient.post(`/classes/${classId}/quizzes`, {
    body: quizData,
  });
};
