import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from 'recharts';
import { useEffect, useState } from 'react';

import { MasterStatisticsResponse } from '@youquiz/shared/interfaces/response';
import { QuizData } from '@youquiz/shared/interfaces/utils/quizdata.interface';
import LoadingSpinner from '@/shared/assets/icons/loading-alt-loop.svg?react';

interface AnswerStatProps {
  answerStats: MasterStatisticsResponse['choiceStatus'];
  quizData: QuizData | null;
  participantCount: number;
}

const calculateTickCount = (maxValue: number): number => {
  const maxTicks = 5;

  const divisors = Array.from({ length: maxValue }, (_, i) => i + 1).filter(
    (num) => maxValue % num === 0,
  );
  return Math.max(divisors[Math.min(divisors.length - 1, maxTicks - 1)], 2);
};

export default function AnswerGraph({ answerStats, quizData, participantCount }: AnswerStatProps) {
  const [answerStatsArray, setAnswerStatsArray] = useState<{ answer: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quizData?.choices) {
      const formattedData = Object.entries(answerStats).map(([key, count]) => ({
        answer:
          `${parseInt(key) + 1}번: ${quizData.choices[parseInt(key)].content}` || `답변 ${key}`,
        count,
      }));
      setAnswerStatsArray(formattedData);
      setLoading(false);
    }
  }, [quizData, answerStats]);

  const tickCount = calculateTickCount(participantCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner width={50} height={50} />
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={answerStatsArray} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="answer" axisLine={false} tickLine={false} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickCount={tickCount}
          domain={[0, participantCount]}
        />
        <Tooltip formatter={(value: number) => [`${value}명`, '참여자 수']} />
        <Legend formatter={() => '참여자 수'} />
        <Bar dataKey="count" fillOpacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
