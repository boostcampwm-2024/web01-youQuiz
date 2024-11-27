import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getCookie } from '@/shared/utils/cookie';
import AnswerGraph from '@/pages/quiz-master-session/ui/AnswerChart';
import RecentSubmittedAnswers from './ui/RecentSubmittedAnswers';
import { getQuizSocket } from '@/shared/utils/socket';
import StatisticsGroup from './ui/StatisticsGroup';
import { QuizData } from '@youquiz/shared/interfaces/utils/quizdata.interface';
import {
  TimerTickResponse,
  MasterStatisticsResponse,
  ShowQuizResponse,
} from '@youquiz/shared/interfaces/response';
import {
  INITIAL_QUIZ_DATA,
  INITIAL_TICK,
  INITIAL_MASTER_STATISTICS,
  INITIAL_EMOJI,
} from '@/shared/constants/initialState';
import EmojiChart from './ui/EmojiChart';

export default function QuizMasterSession() {
  const { pinCode } = useParams();
  const navigate = useNavigate();
  const socket = getQuizSocket();
  const [masterStatistics, setMasterStatistics] =
    useState<MasterStatisticsResponse>(INITIAL_MASTER_STATISTICS);
  const [quizData, setQuizData] = useState<QuizData>(INITIAL_QUIZ_DATA);
  const [tick, setTick] = useState<TimerTickResponse>(INITIAL_TICK);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isLastQuiz, setIsLastQuiz] = useState(false);
  const [reactionStats, setReactionStats] = useState(INITIAL_EMOJI);

  const initQuizData = () => {
    setQuizData(INITIAL_QUIZ_DATA);
    setMasterStatistics(INITIAL_MASTER_STATISTICS);
    setTick(INITIAL_TICK);
  };

  const handleNextQuiz = () => {
    if (isLastQuiz) {
      socket.emit('end quiz', { pinCode, sid: getCookie('sid') });
      navigate('/quiz/session/end');
      return;
    }
    if (Math.floor(tick.remainingTime / 1000) !== 0) {
      initQuizData();
      setQuizIndex((prev) => prev + 1);
      socket.emit('show quiz', { pinCode });
    }
  };

  useEffect(() => {
    socket.emit('show quiz', { pinCode });

    const handleShowQuiz = (response: ShowQuizResponse) => {
      const { currentQuizData, isLast } = response;
      setQuizData(currentQuizData);
      setIsLastQuiz(isLast);
    };
    const handleMasterStatistics = (response: MasterStatisticsResponse) => {
      setMasterStatistics(response);
    };
    const handleTimerTick = (response: TimerTickResponse) => {
      setTick(response);
    };

    const handleReactionUpdate = (response: { easy: number; hard: number }) => {
      setReactionStats(response);
    };

    socket.on('show quiz', handleShowQuiz);
    socket.on('master statistics', handleMasterStatistics);
    socket.on('timer tick', handleTimerTick);
    socket.on('emoji', handleReactionUpdate);

    return () => {
      socket.off('show quiz', handleShowQuiz);
      socket.off('master statistics', handleMasterStatistics);
      socket.off('timer tick', handleTimerTick);
    };
  }, []);
  return (
    <div className="w-screen min-h-screen">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">실시간 통계</h1>
            <p className="text-2xl font-bold mb-2">
              Q{quizIndex + 1}. {quizData.content}
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-500 mb-2">
              제한 시간{' '}
              {Math.floor(tick.remainingTime / 1000) === 0
                ? '종료'
                : Math.floor(tick.remainingTime / 1000)}
            </p>
            <div className="mb-2">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50
  `}
                onClick={handleNextQuiz}
                disabled={Math.floor(tick.remainingTime / 1000) !== 0}
              >
                다음 퀴즈
              </button>
            </div>
          </div>
        </div>
      </div>
      <StatisticsGroup participantStatistics={masterStatistics} />
      <div className="grid grid-cols-[3fr_1fr] gap-4 mx-5 h-[650px]">
        <AnswerGraph answerStats={masterStatistics.choiceStatus} />
        <div>
          <RecentSubmittedAnswers userSubmitHistory={masterStatistics.submitHistory} />
          <EmojiChart reactionStats={reactionStats} />
        </div>
      </div>
    </div>
  );
}
