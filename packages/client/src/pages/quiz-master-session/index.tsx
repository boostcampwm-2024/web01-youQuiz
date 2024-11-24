import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

const initialParticipantStatistics: MasterStatistics = {
  averageTime: 0,
  choiceStatus: { 0: 0, 1: 0, 2: 0, 3: 0 },
  participantRate: 0,
  solveRate: 0,
  submitHistory: [],
  totalSubmit: 0,
};

const initialQuizData = {
  id: '',
  content: '',
  choices: [],
};

const initialTick = {
  currentTime: 0,
  elapsedTime: 0,
  remainingTime: 0,
};

export default function QuizMasterSession() {
  const { pinCode } = useParams();
  const socket = getQuizSocket();
  const [participantStatistics, setParticipantStatistics] = useState<MasterStatistics>(
    initialParticipantStatistics,
  );
  const [quizData, setQuizData] = useState(initialQuizData);
  const [tick, setTick] = useState(initialTick);

  const initQuizData = () => {
    setQuizData(initialQuizData);
    setParticipantStatistics(initialParticipantStatistics);
    setTick(initialTick);
  };

  const handleNextQuiz = () => {
    socket.emit('show quiz', { pinCode });
    initQuizData();
  };

  useEffect(() => {
    socket.emit('show quiz', { pinCode });

    socket.on('show quiz', (response) => {
      const { currentQuizData } = response;
      setQuizData(currentQuizData);
    });

    socket.on('master statistics', (response: MasterStatistics) => {
      setParticipantStatistics(response);
    });

    socket.on('timer tick', (response) => {
      setTick(response);
    });
  }, []);

  return (
    <div className="w-screen min-h-screen">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">실시간 통계</h1>
            <p className="text-2xl font-bold mb-2">
              Q{quizData.id}. {quizData.content}
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
              <CustomButton label="다음 퀴즈" type="full" onClick={handleNextQuiz} />
            </div>
          </div>
        </div>
      </div>
      <StatisticsGroup participantStatistics={participantStatistics} />
      <div className="grid grid-cols-[3fr_1fr] gap-4 mx-5 h-[650px]">
        <AnswerGraph answerStats={participantStatistics.choiceStatus} />
        <RecentSubmittedAnswers userSubmitHistory={participantStatistics.submitHistory} />
      </div>
    </div>
  );
}
