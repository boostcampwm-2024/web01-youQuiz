import { Suspense } from 'react';
import QuizLoading from '@/pages/quiz-session/ui/QuizLoading';
import { ErrorBoundary } from 'react-error-boundary';

export default function AsyncBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<div>안녕하세요?</div>}>
      <Suspense fallback={<QuizLoading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
