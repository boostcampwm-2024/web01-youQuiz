import AsyncBoundary from '@/shared/boundary/AsyncBoundary';
import QuizMasterSessionLazyPage from './index.lazy';

export default function QuizMasterSession() {
  return (
    <AsyncBoundary>
      <QuizMasterSessionLazyPage />
    </AsyncBoundary>
  );
}
