import AsyncBoundary from '@/shared/boundary/AsyncBoundary';
import QuizSessionLazyPage from './index.lazy';

export default function QuizSession() {
  return (
    <AsyncBoundary>
      <QuizSessionLazyPage />
    </AsyncBoundary>
  );
}
