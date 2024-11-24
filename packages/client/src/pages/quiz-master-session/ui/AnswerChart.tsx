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

interface AnswerStatProps {
  answerStats: Record<`${0 | 1 | 2 | 3}`, number>;
}

export default function AnswerGraph({ answerStats }: AnswerStatProps) {
  const answerStatsArray = Object.entries(answerStats).map(([answer, count]) => ({
    answer,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={answerStatsArray} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="answer" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} tickCount={6} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fillOpacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
