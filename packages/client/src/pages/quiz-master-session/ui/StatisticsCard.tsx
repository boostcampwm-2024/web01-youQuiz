interface StatisticsCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  subDescription: string;
}

export default function StatisticsCard({
  title,
  value,
  unit,
  color,
  subDescription,
}: StatisticsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-md">{title}</p>
          <p className="text-2xl font-bold">{`${value}${unit}`}</p>
          <p className={`${color} text-md`}>{subDescription}</p>
        </div>
      </div>
    </div>
  );
}
