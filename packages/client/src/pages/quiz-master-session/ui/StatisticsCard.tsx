interface StatisticsCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

export default function StatisticsCard({ title, value, unit, color }: StatisticsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-md">{title}</p>
          <p className={`text-2xl ${color} font-bold`}>{`${value}${unit}`}</p>
        </div>
      </div>
    </div>
  );
}
