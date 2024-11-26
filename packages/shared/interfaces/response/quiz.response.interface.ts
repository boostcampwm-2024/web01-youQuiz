import { ChoiceResponse } from './choice.response.interface';

export interface QuizResponse {
  id: number;
  content: string;
  quizType: string;
  timeLimit: number;
  point: number;
  position: number;
  choices: ChoiceResponse[];
}
