interface Choice {
  id: number;
  quizId: number;
  content: string;
  isCorrect: boolean;
  position: number;
}

interface QuizData {
  id: number;
  content: string;
  quizType: QuizType;
  timeLimit: number;
  point: number;
  position: number;
  choices: Choice[];
}
