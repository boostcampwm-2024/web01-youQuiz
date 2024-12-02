import AsyncBoundary from '@/shared/boundary/AsyncBoundary';
import QuizWaitLazyPage from './index.lazy';

export default function QuizWaitPage() {
  return (
    <AsyncBoundary>
      <QuizWaitLazyPage />
    </AsyncBoundary>
  );
}
