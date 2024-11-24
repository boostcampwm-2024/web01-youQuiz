import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProgressBar from '@/shared/ui/progress-bar/ProgressBar';
import { CustomButton } from '@/shared/ui/buttons';
import AnswerGraph from '@/pages/quiz-master-session/ui/AnswerChart';
import RecentSubmittedAnswers from './ui/RecentSubmittedAnswers';
import { getQuizSocket } from '@/shared/utils/socket';
import StatisticsGroup from './ui/StatisticsGroup';

interface MasterStatistics {
  averageTime: number;
  choiceStatus: Record<`${0 | 1 | 2 | 3}`, number>;
  participantRate: number;
  solveRate: number;
  submitHistory: [string, number][];
  totalSubmit: number;
}

const limitedTime = 20;

export default function QuizMasterSession() {
  const { pinCode, id } = useParams();
  const socket = getQuizSocket();
  const [participantStatistics, setParticipantStatistics] = useState<MasterStatistics>({
    averageTime: 0,
    choiceStatus: { 0: 0, 1: 0, 2: 0, 3: 0 },
    participantRate: 0,
    solveRate: 0,
    submitHistory: [],
    totalSubmit: 0,
  });

  const [time, setTime] = useState<number | string>(limitedTime);

  const tick = () => {
    setTime((prev) => {
      if (typeof prev === 'string') return '종료';
      if (prev === 0) return '종료';
      return prev - 1;
    });
  };

  const handleNextQuiz = () => {
    socket.emit('start quiz', { pinCode });
  };

  useEffect(() => {
    socket.emit('show quiz', { pinCode });

    socket.on('master statistics', (response: MasterStatistics) => {
      setParticipantStatistics(response);
    });

    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen min-h-screen">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">실시간 통계</h1>
            <p className="text-2xl font-bold mb-2">{id}Q. 퀴즈 제목</p>
          </div>
          <div>
            <p className="font-bold text-gray-500 mb-2">제한 시간 {time}</p>
            <div className="mb-2">
              <CustomButton label="다음 퀴즈" type="full" onClick={handleNextQuiz} />
            </div>
          </div>
        </div>

        <ProgressBar time={limitedTime} type="info" />
      </div>
      <StatisticsGroup participantStatistics={participantStatistics} />
      <div className="grid grid-cols-[3fr_1fr] gap-4 mx-5 h-[650px]">
        <AnswerGraph answerStats={participantStatistics.choiceStatus} />
        <RecentSubmittedAnswers userSubmitHistory={participantStatistics.submitHistory} />
      </div>
    </div>
  );
}
