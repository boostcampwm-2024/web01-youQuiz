interface ReactionStats {
  easy: number;
  hard: number;
}

interface EmojiChartProps {
  reactionStats: ReactionStats;
}

export default function EmojiChart({ reactionStats }: EmojiChartProps) {
  const totalVotes = reactionStats.easy + reactionStats.hard;

  const calculatePercentage = (count: number) => {
    if (totalVotes === 0) return 50;

    return Number(((count / totalVotes) * 100).toFixed(1));
  };

  const results = [
    {
      text: '쉬워요',
      count: reactionStats.easy,
      percentage: calculatePercentage(reactionStats.easy),
      color: '#dcfce7',
      textColor: '#16a34a',
    },
    {
      text: '어려워요',
      count: reactionStats.hard,
      percentage: calculatePercentage(reactionStats.hard),
      color: '#fee2e2',
      textColor: '#dc2626',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full h-1/3 max-w-lg mx-auto p-4 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-gray-700 text-xl font-bold mb-6 text-center">참여자 반응</h3>
      <div className="flex justify-between w-full mb-2">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{ width: `${result.percentage}%` }}
          >
            <span className="font-medium text-lg mb-1" style={{ color: result.textColor }}>
              {result.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full h-12 rounded-lg overflow-hidden">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex justify-center items-center transition-all duration-300 h-full"
            style={{
              backgroundColor: result.color,
              width: `${result.percentage}%`,
            }}
          >
            <span className="font-medium text-lg" style={{ color: result.textColor }}>
              {result.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
