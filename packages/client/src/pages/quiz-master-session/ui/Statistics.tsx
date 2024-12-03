import { INITIAL_MASTER_STATISTICS } from '@/shared/constants/initialState';
import { INITIAL_EMOJI } from '@/shared/constants/initialState';
import AnswerGraph from './AnswerChart';
import RecentSubmittedAnswers from './RecentSubmittedAnswers';
import StatisticsGroup from './StatisticsGroup';
import EmojiChart from './EmojiChart';
import { useEffect } from 'react';
import { MasterStatisticsResponse } from '@youquiz/shared/interfaces/response/master-statistics.response.interface';
import { getQuizSocket } from '@/shared/utils/socket';
import { usePersistState } from '@/shared/hooks/usePersistState';

interface StatisticsProps {
  quizData: QuizData;
  initializeStates: boolean;
  setInitializeStates: React.Dispatch<React.SetStateAction<boolean>>;
  totalParticipants: number;
}

interface HistoryItem {
  user: string;
  submitTime: number;
  elapsedTime: number;
  displayTime: string;
}

export default function Statistics({
  quizData,
  initializeStates,
  setInitializeStates,
  totalParticipants,
}: StatisticsProps) {
  const socket = getQuizSocket();
  const [masterStatistics, setMasterStatistics] = usePersistState<MasterStatisticsResponse>(
    'masterStatistics',
    INITIAL_MASTER_STATISTICS,
  );
  const [reactionStats, setReactionStats] = usePersistState('reactionStats', INITIAL_EMOJI);
  const [history, setHistory] = usePersistState<HistoryItem[]>('history', []);

  const initializeStatistics = () => {
    setMasterStatistics(INITIAL_MASTER_STATISTICS);
    setReactionStats(INITIAL_EMOJI);
    setHistory([]);
  };

  useEffect(() => {
    const handleMasterStatistics = (response: MasterStatisticsResponse) => {
      setMasterStatistics(response);
    };

    const handleReactionUpdate = (response: { easy: number; hard: number }) => {
      setReactionStats(response);
    };

    socket.on('master statistics', handleMasterStatistics);
    socket.on('emoji', handleReactionUpdate);

    return () => {
      socket.off('master statistics', handleMasterStatistics);
      socket.off('emoji', handleReactionUpdate);
    };
  }, []);

  useEffect(() => {
    if (initializeStates) {
      initializeStatistics();
      setInitializeStates(false);
    }
  }, [initializeStates]);

  return (
    <>
      <StatisticsGroup participantStatistics={masterStatistics} />
      <div className="grid grid-cols-[3fr_1fr] gap-4 mx-5 h-[calc(100vh-300px)]">
        <AnswerGraph
          answerStats={masterStatistics.choiceStatus}
          totalParticipants={totalParticipants}
          quizData={quizData}
        />
        <div>
          <RecentSubmittedAnswers
            userSubmitHistory={masterStatistics.submitHistory}
            history={history}
            setHistory={setHistory}
          />
          <EmojiChart reactionStats={reactionStats} />
        </div>
      </div>
    </>
  );
}
