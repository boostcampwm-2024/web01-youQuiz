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
  quizData: QuizData;
  participantCount: number;
}

export default function AnswerGraph({ answerStats, quizData, participantCount }: AnswerStatProps) {
  const [loadedQuizData, setLoadedQuizData] = useState<QuizData | null>(null);
  const [answerStatsArray, setAnswerStatsArray] = useState<{ answer: string; count: number }[]>([]);

  useEffect(() => {
    if (quizData) {
      setLoadedQuizData(quizData);

      const updatedAnswerStatsArray = Object.entries(answerStats).map(([answer, count]) => {
        const choice = quizData.choices[parseInt(answer)];
        return {
          answer: choice
            ? `${parseInt(answer) + 1}번 ${choice.content}`
            : `${parseInt(answer) + 1}번 미정`,
          count,
        };
      });
      setAnswerStatsArray(updatedAnswerStatsArray);
    }
  }, [quizData, answerStats]);

  if (!loadedQuizData) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <LoadingSpinner className="animate-spin w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={answerStatsArray} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="answer" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} tickCount={5} domain={[0, participantCount]} />
        <Tooltip formatter={(value: number) => [`${value}명`, '참여자 수']} />
        <Legend formatter={() => '참여자 수'} />
        <Bar dataKey="count" fillOpacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
