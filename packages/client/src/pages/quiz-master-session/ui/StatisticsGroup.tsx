import StatisticsCard from './StatisticsCard';

interface ParticipantStatistics {
  averageTime: number;
  participantRate: number;
  solveRate: number;
  totalSubmit: number;
}
interface MasterStatistics extends ParticipantStatistics {
  submitHistory: [string, number][];
  choiceStatus: Record<`${0 | 1 | 2 | 3}`, number>;
}
interface StatisticsGroupProps {
  participantStatistics: MasterStatistics | ParticipantStatistics;
}

export default function StatisticsGroup({ participantStatistics }: StatisticsGroupProps) {
  const statisticsCardItems = [
    {
      title: '총 제출',
      value: participantStatistics.totalSubmit,
      unit: '명',
      color: 'text-green-500',
    },
    {
      title: '정답률',
      value: Number(participantStatistics.solveRate.toFixed(1)),
      unit: '%',
      color: 'text-blue-500',
    },
    {
      title: '평균 풀이 시간',
      value: Number((participantStatistics.averageTime / 100000).toFixed(1)),
      unit: '초',
      color: 'text-orange-500',
    },
    {
      title: '평균 참여율',
      value: Number(participantStatistics.participantRate.toFixed(1)),
      unit: '%',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mb-8 mx-5">
      {statisticsCardItems.map((item) => (
        <StatisticsCard key={item.title} {...item} />
      ))}
    </div>
  );
}
