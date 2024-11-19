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

interface AnswerStat {
  answer: string;
  count: number;
  color: string;
}

interface AnswerStatProps {
  answerStats: AnswerStat[];
}

export default function AnswerGraph({ answerStats }: AnswerStatProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={answerStats} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="answer" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} tickCount={6} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="primary" fillOpacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
