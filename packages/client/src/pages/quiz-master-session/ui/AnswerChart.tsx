import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  Cell,
} from 'recharts';

import { MasterStatisticsResponse } from '@youquiz/shared/interfaces/response';
import { QuizData } from '@youquiz/shared/interfaces/utils/quizdata.interface';

interface AnswerStatProps {
  answerStats: MasterStatisticsResponse['choiceStatus'];
  quizData: QuizData;
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
  const answerStatsArray = quizData.choices.map((choice, index) => ({
    answer: `${index + 1}번: ${choice.content} ${choice.isCorrect ? '(정답)' : ''}`,
    count: answerStats[index] || 0,
    isCorrect: choice.isCorrect,
  }));
  const tickCount = calculateTickCount(participantCount);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={answerStatsArray} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="answer"
          axisLine={false}
          tickLine={false}
          tick={({ x, y, payload }) => {
            const answerData = answerStatsArray.find((item) => item.answer === payload.value);
            const isCorrect = answerData?.isCorrect;
            return (
              <text
                x={x}
                y={y + 15}
                textAnchor="middle"
                fill={isCorrect ? 'green' : '#000'}
                fontWeight={isCorrect ? 'bold' : 'normal'}
              >
                {payload.value}
              </text>
            );
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickCount={tickCount}
          domain={[0, participantCount]}
        />
        <Tooltip formatter={(value: number) => [`${value}명`, '참여자 수']} />
        <Legend formatter={() => '참여자 수'} />
        <Bar dataKey="count" fillOpacity={0.8} isAnimationActive>
          {answerStatsArray.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isCorrect ? '#15803D' : '#2C2C2C'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
