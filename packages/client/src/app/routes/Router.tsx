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
import QuizMasterSession from '@/pages/quiz-master-session';
import Leaderboard from '@/pages/leaderboard';
import QuizListPage from '@/pages/quiz-list';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route element={<HostLayout />}>
        <Route path="/quiz-list" element={<QuizListPage />} />
        <Route path="/quiz/create/:classId" element={<QuizCreatePage />} />
        <Route path="/questions" element={<QnA />} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/quiz/session/:pinCode/:id" element={<QuizSession />} />
        <Route path="/quiz/wait/:pinCode" element={<QuizWait />} />
        <Route path="/nickname/:pinCode" element={<Nickname />} />
        <Route path="/guest/questions" element={<GuestQnA />} />
      </Route>
      <Route path="/quiz/question" element={<QuizQuestion />} />
      <Route path="/quiz/session/host/:pinCode/:id" element={<QuizMasterSession />} />
      <Route path="/quiz/session/end" element={<Leaderboard />} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}
