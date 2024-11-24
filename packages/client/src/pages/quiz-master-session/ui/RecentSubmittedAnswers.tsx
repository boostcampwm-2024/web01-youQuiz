import { useEffect, useState } from 'react';

// TODO: 실시간으로 변경되는 데이터를 받아야 함
interface RecentSubmittedAnswersProps {
  userSubmitHistory: [string, number][];
}

const randomColor = ['#3B82F6', '#F87171', '#34D399', '#FBBF24'];

export default function RecentSubmittedAnswers({ userSubmitHistory }: RecentSubmittedAnswersProps) {
  const [time, setTime] = useState(0);

  const tick = () => {
    setTime((prev) => prev + 1);
  };

  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const recentHistory = userSubmitHistory.slice(0, 4);
  return (
    <div>
      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">최근 제출 답안</h3>
        </div>
        <div className="divide-y">
          {recentHistory.map((user, index) => (
            <div
              key={user[0]}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    backgroundColor: randomColor[index % 4],
                  }}
                >
                  {user[0][0]}
                </div>
                <div>
                  <p className="font-medium">{user[0]}님</p>
                  <p className="text-sm text-gray-500">{time}초 전 제출</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* 제출 시 걸리는 시간 */}
                <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                  {Math.floor(user[1] / 1000)}초
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
