import { Routes, Route } from 'react-router-dom';

import HostLayout from '@/app/layouts/HostLayout';
import QuizCreatePage from '@/pages/quiz-create';
import GuestLayout from '@/app/layouts/GuestLayout';
import NotFound from '@/app/routes/NotFound';
import QuizSession from '@/pages/quiz-session';
export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<h1>MAIN PAGE</h1>} />
      <Route element={<HostLayout />}>
        <Route path="/quiz/create" element={<QuizCreatePage />} />
        <Route path="/questions" element={<div>questions</div>} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/quiz/wait" element={<div>waiting</div>} />
        <Route path="/nickname" element={<div>nickname</div>} />
        <Route path="/quiz/session" element={<QuizSession />} />
      </Route>
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
