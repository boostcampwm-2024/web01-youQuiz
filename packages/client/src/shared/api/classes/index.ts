import { QuizData } from '@/pages/quiz-create';
import { apiClient } from '..';

interface ClassesData {
  id: number;
  title: string;
  quizzes: QuizData[];
}

export interface ClassesResponse {
  data: ClassesData[];
  message: string;
  statusCode: number;
}

interface CreateClassRequest {
  title: string;
  description: string;
}

interface CreateClassResponseData {
  id: number;
  title: string;
}

interface CreateClassResponse {
  data: CreateClassResponseData;
  message: string;
  statusCode: number;
}

export async function getClasses(): Promise<ClassesResponse> {
  return await apiClient.get('/classes');
}

export async function createClass(data: CreateClassRequest): Promise<CreateClassResponse> {
  return await apiClient.post('/classes', {
    body: data,
  });
}

export async function deleteClass(id: number): Promise<void> {
  return await apiClient.delete(`/classes/${id}`);
}
