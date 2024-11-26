import StatisticsGroup from '@/pages/quiz-master-session/ui/StatisticsGroup';
import { ParticipantStatisticsResponse } from '@youquiz/shared/interfaces/response';
interface AfterQuizSubmitProps {
  participantStatistics: ParticipantStatisticsResponse;
  submitOrder: number;
}

export default function AfterQuizSubmit({
  participantStatistics,
  submitOrder,
}: AfterQuizSubmitProps) {
  return (
    <div className="absolute top-0 z-10 p-6 w-full h-full mb-8 backdrop-blur-sm animate-[floatDown_1s_ease-in-out_forwards]">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <StatisticsGroup participantStatistics={participantStatistics} />
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">나는 몇 번째로 제출했을까?</span>
          <span>{submitOrder}번째로 제출했습니다!</span>
        </div>
      </div>
    </div>
  );
}
