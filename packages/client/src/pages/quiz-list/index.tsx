import AsyncBoundary from '@/shared/boundary/AsyncBoundary';
import QuizListLazyPage from './index.lazy';

export default function QuizListPage() {
  return (
    <AsyncBoundary>
      <QuizListLazyPage />
    </AsyncBoundary>
  );
}
