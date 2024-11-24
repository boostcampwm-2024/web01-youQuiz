import StatisticsCard from './StatisticsCard';

interface MasterStatistics {
  averageTime: number;
  choiceStatus: Record<`${0 | 1 | 2 | 3}`, number>;
  participantRate: number;
  solveRate: number;
  submitHistory: [string, number][];
  totalSubmit: number;
}

interface StatisticsGroupProps {
  participantStatistics: MasterStatistics;
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
      value: participantStatistics.solveRate,
      unit: '%',
      color: 'text-blue-500',
    },
    {
      title: '평균 풀이 시간',
      value: participantStatistics.averageTime / 100000,
      unit: '초',
      color: 'text-orange-500',
    },
    {
      title: '평균 참여율',
      value: participantStatistics.participantRate,
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
