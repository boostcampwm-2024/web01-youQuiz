import { StatisticsData } from './QuizBox';
import StatisticsGroup from '@/pages/quiz-master-session/ui/StatisticsGroup';

interface AfterQuizSubmitProps {
  participantStatistics: StatisticsData;
}

export default function AfterQuizSubmit({ participantStatistics }: AfterQuizSubmitProps) {
  return (
    <div className="absolute top-0 z-10 p-6 w-full h-full mb-8 backdrop-blur-sm animate-[floatDown_1s_ease-in-out_forwards]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <StatisticsGroup participantStatistics={participantStatistics} />
        <div className="flex items-center justify-center">
          <span className="text-xl font-semibold">나는 몇 등이지?</span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
