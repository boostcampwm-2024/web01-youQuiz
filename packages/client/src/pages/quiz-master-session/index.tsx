import { useParams } from 'react-router-dom';
import StatisticsCard from './ui/StatisticsCard';

import { useEffect, useState } from 'react';
import ProgressBar from '@/shared/ui/progress-bar/ProgressBar';
import { CustomButton } from '@/shared/ui/buttons';
import AnswerGraph from '@/pages/quiz-master-session/ui/AnswerChart';
import RecentSubmittedAnswers from './ui/RecentSubmittedAnswers';
import { getQuizSocket } from '@/shared/utils/socket';

interface AnswerStat {
  answer: string;
  count: number;
  color: string;
}

const statisticsCardItems = [
  {
    title: '총 제출',
    value: 35,
    unit: '명',
    color: 'text-green-500',
    subDescription: '+22명 남음',
  },
  {
    title: '정답률',
    value: 65,
    unit: '%',
    color: 'text-blue-500',
    subDescription: '평균 대비 +5%',
  },
  {
    title: '평균 풀이 시간',
    value: 5,
    unit: '초',
    color: 'text-orange-500',
    subDescription: '목표 시간 내 해결',
  },
  {
    title: '평균 정답률',
    value: 60,
    unit: '%',
    color: 'text-purple-500',
    subDescription: '목표 85% 미달성',
  },
];

const limitedTime = 20;

export default function QuizMasterSession() {
  const { pinCode, id } = useParams();
  const socket = getQuizSocket();

  const [answerStats, setAnswerStats] = useState<AnswerStat[]>([
    { answer: '1번', count: 10, color: '#3B82F6' },
    { answer: '2번', count: 20, color: '#F87171' },
    { answer: '3번', count: 15, color: '#34D399' },
    { answer: '4번', count: 25, color: '#FBBF24' },
  ]);

  const [time, setTime] = useState<number | string>(limitedTime);

  const tick = () => {
    setTime((prev) => {
      if (typeof prev === 'string') return '종료';
      if (prev === 0) return '종료';
      return prev - 1;
    });
    // 랜덤 데이터 생성
    setAnswerStats((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          count: Math.floor(Math.random() * 100),
        };
      });
    });
  };

  const handleNextQuiz = () => {
    socket.emit('start quiz', { pinCode });
  };

  useEffect(() => {
    socket.emit('show quiz', { pinCode });

    socket.emit('total status', { pinCode }, (response: any) => {
      console.log(response);
    });

    socket.on('timer end', (response) => {
      console.log(response);
    });

    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-screen min-h-screen">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold mb-2">실시간 통계</h1>
            <p className="text-2xl font-bold mb-2">{id}Q. 퀴즈 제목</p>
          </div>
          <div>
            <p className="font-bold text-gray-500 mb-2">제한 시간 {time}</p>
            <div className="mb-2">
              <CustomButton label="다음 퀴즈" type="full" onClick={handleNextQuiz} />
            </div>
          </div>
        </div>

        <ProgressBar time={limitedTime} type="info" />
      </div>
      <div className="grid grid-cols-4 gap-6 mb-8 mx-5">
        {statisticsCardItems.map((item) => (
          <StatisticsCard key={item.title} {...item} />
        ))}
      </div>
      <div className="grid grid-cols-[3fr_1fr] gap-4 mx-5">
        <AnswerGraph answerStats={answerStats} />
        <RecentSubmittedAnswers answerStats={answerStats} />
      </div>
    </div>
  );
}
