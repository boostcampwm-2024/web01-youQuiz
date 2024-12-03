import { Suspense } from 'react';
import QuizLoading from '@/pages/quiz-session/ui/QuizLoading';

export default function AsyncBoundary({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<QuizLoading />}>{children}</Suspense>;
}
