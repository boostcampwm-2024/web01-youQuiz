import { formatElapsedTime } from '@/shared/utils/formatElapsedTime';
import { useEffect } from 'react';

interface HistoryItem {
  user: string;
  submitTime: number;
  elapsedTime: number;
  displayTime: string;
}

interface RecentSubmittedAnswersProps {
  userSubmitHistory: [string, number][];
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

const randomColor = ['#3B82F6', '#F87171', '#34D399', '#FBBF24'];

export default function RecentSubmittedAnswers({
  userSubmitHistory,
  history,
  setHistory,
}: RecentSubmittedAnswersProps) {
  useEffect(() => {
    setHistory((prev) => {
      const newHistory = userSubmitHistory.map(([user, submitTime]) => {
        const existedHistory = prev.find(
          (item) => item.user === user && item.submitTime === submitTime,
        );
        return {
          user,
          submitTime,
          elapsedTime: existedHistory ? existedHistory.elapsedTime : 0,
          displayTime: existedHistory ? existedHistory.displayTime : '',
        };
      });

      const mergedHistory = [...newHistory, ...prev].reduce<HistoryItem[]>((acc, item) => {
        if (!acc.some((i) => i.user === item.user && i.submitTime === item.submitTime)) {
          acc.push(item);
        }
        return acc;
      }, []);

      return mergedHistory;
    });
  }, [userSubmitHistory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory((prev) =>
        prev.map((item) => ({
          ...item,
          elapsedTime: item.elapsedTime + 1,
          displayTime: formatElapsedTime(item.elapsedTime + 1),
        })),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grow overflow-y-scroll">
      <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">최근 제출 답안</h3>
        </div>
        <div className="divide-y">
          {history.map((item, index) => (
            <div
              key={`${item.user}-${item.submitTime}`}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                  style={{
                    backgroundColor: randomColor[index % 4],
                  }}
                >
                  {item.user[0]}
                </div>
                <div>
                  <p className="font-medium">{item.user}님</p>
                  <p className="text-sm text-gray-500">{item.displayTime || '방금 전'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* 제출 시 걸리는 시간 */}
                <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                  {Math.floor(item.submitTime / 1000)}초
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
