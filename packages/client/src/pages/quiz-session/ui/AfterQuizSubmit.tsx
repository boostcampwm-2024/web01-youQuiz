import { StatisticsData } from './QuizBox';
import StatisticsGroup from '@/pages/quiz-master-session/ui/StatisticsGroup';

interface AfterQuizSubmitProps {
  participantStatistics: StatisticsData;
}

export default function AfterQuizSubmit({ participantStatistics }: AfterQuizSubmitProps) {
  return (
    <div className="absolute top-0 z-10 p-6 w-full h-full mb-8 backdrop-blur-sm animate-[floatDown_1s_ease-in-out_forwards]">
      <StatisticsGroup participantStatistics={participantStatistics} />
    </div>
  );
}
