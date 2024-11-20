interface Choice {
  id: number;
  quizId: number;
  content: string;
  isCorrect: boolean;
  position: number;
}
interface QuizData {
  id: string;
  content: string;
  choices: Choice[];
}
