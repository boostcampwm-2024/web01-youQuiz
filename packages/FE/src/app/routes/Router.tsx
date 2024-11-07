import { Routes, Route } from 'react-router-dom';

import HostLayout from '@/app/layouts/HostLayout';
import GuestLayout from '@/app/layouts/GuestLayout';
import NotFound from '@/app/routes/NotFound';
import QuizWait from '@/pages/quiz-wait';
import Nickname from '@/pages/nickname';
import QuizQuestion from '@/pages/quiz-question';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<h1>MAIN PAGE</h1>} />
      <Route element={<HostLayout />}>
        <Route path="/quiz/create" element={<div>create</div>} />
        <Route path="/questions" element={<div>questions</div>} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/quiz/wait" element={<QuizWait />} />
        <Route path="/nickname" element={<Nickname />} />
      </Route>
      <Route path="quiz/question" element={<QuizQuestion />} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
