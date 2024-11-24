import { QuizData } from '../utils/quizdata.interface';

export interface ShowQuizResponse {
  currentQuizData: QuizData;
  isLast: boolean;
}
