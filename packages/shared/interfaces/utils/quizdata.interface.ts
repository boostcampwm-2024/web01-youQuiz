import { Choice } from './choice.interface';

export interface QuizData {
  id: number;
  content: string;
  quizType: 'MC' | 'TF';
  timeLimit: number;
  point: number;
  position: number;
  choices: Choice[];
}
