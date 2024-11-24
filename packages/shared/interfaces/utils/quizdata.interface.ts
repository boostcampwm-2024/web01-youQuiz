import { Choice } from './choice.interface';
import { QuizType } from '../../types/quiz.types';

export interface QuizData {
  id: number;
  content: string;
  quizType: QuizType;
  timeLimit: number;
  point: number;
  position: number;
  choices: Choice[];
}
