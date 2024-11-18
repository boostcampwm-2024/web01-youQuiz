import { Routes, Route } from 'react-router-dom';

import HostLayout from '@/app/layouts/HostLayout';
import MainPage from '@/pages/main';
import QuizCreatePage from '@/pages/quiz-create';
import GuestLayout from '@/app/layouts/GuestLayout';
import NotFound from '@/app/routes/NotFound';
import QuizSession from '@/pages/quiz-session';
import QuizWait from '@/pages/quiz-wait';
import Nickname from '@/pages/nickname';
import QuizQuestion from '@/pages/quiz-question';
import QnA from '@/pages/qna';
import GuestQnA from '@/pages/guest-qna';
import QuizList from '@/pages/quiz-list';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route element={<HostLayout />}>
        <Route path="/quiz-list" element={<QuizList />} />
        <Route path="/quiz/create" element={<QuizCreatePage />} />
        <Route path="/questions" element={<QnA />} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/quiz/session" element={<QuizSession />} />
        <Route path="/quiz/wait" element={<QuizWait />} />
        <Route path="/nickname" element={<Nickname />} />
        <Route path="/guest/questions" element={<GuestQnA />} />
      </Route>
      <Route path="/quiz/question" element={<QuizQuestion />} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
