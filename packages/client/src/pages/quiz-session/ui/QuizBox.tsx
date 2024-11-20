import { Dispatch, SetStateAction, useState, useRef, useEffect, useCallback } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
interface ReactionData {
  easy: number;
  hard: number;
}

interface QuizBoxProps {
  reactionStats: ReactionData;
  setReactionStats: Dispatch<SetStateAction<ReactionData>>;
  quiz: QuizData;
}

export default function QuizBox({ reactionStats, setReactionStats, quiz }: QuizBoxProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const easyButtonRef = useRef<HTMLButtonElement>(null);
  const hardButtonRef = useRef<HTMLButtonElement>(null);
  const socket = getQuizSocket();
  console.log(quiz);
  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswer((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx];
    });
  };

  const handleSubmit = () => {
    socket.emit('submit answer', { selectAnswer: selectedAnswer });
    console.log(selectedAnswer);
    setHasSubmitted(true);
  };

  const handleReaction = (reaction: 'easy' | 'hard') => {
    setReactionStats({ ...reactionStats, [reaction]: reactionStats[reaction] + 1 });
    handleFloatUp(reaction);
    socket.emit('emoji', { reaction });
  };

  const handleFloatUp = (reaction: 'easy' | 'hard') => {
    const buttonRef = reaction === 'easy' ? easyButtonRef : hardButtonRef;

    const emoji = document.createElement('div');
    emoji.textContent = reaction === 'easy' ? '😊' : '🤔';
    emoji.className = 'fixed left-4 text-2xl absolute animate-[floatUp_1s_ease-in-out_forwards]';
    buttonRef.current?.appendChild(emoji);

    setTimeout(() => {
      emoji.remove();
    }, 1000);
  };

  const handleReactionUpdate = useCallback((data: ReactionData) => {
    setReactionStats(data);
  }, []);

  const handleSubmitUpdate = useCallback(() => {
    // 제출자에게 제출 완료에 대한 피드백 보여주기
  }, []);

  useEffect(() => {
    socket.on('emoji', handleReactionUpdate);

    socket.on('submit answer', handleSubmitUpdate);

    return () => {
      socket.off('emoji', handleReactionUpdate);
    };
  }, []);

  return (
    <>
      <div className="relative z-10 p-6 max-w-4xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Question 1/10</span>
            <span className="text-sm text-gray-500">난이도</span>
          </div>
          {/* 문제 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{quiz?.content}</h2>
          </div>
          {/* 선택지 */}
          <div className="space-y-4">
            {quiz?.choices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleSelectAnswer(choice.id)}
                className={`w-full p-4 text-left rounded-xl border transition-all ${
                  selectedAnswer.includes(choice.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>
                {choice.content}
              </button>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-between items-center">
          <button
            ref={easyButtonRef}
            onClick={() => handleReaction('easy')}
            className={`relative w-[149px] px-4 py-2 rounded-full transition-all flex items-center justify-center space-x-2 ${
              reactionStats.easy > 0
                ? 'bg-secondary/90 text-white'
                : 'bg-white border hover:border-secondary'
            }`}
          >
            <span className="text-2xl">😊</span>
            <span>쉬워요 ({reactionStats.easy})</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer.length === 0 || hasSubmitted}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              selectedAnswer.length > 0 && !hasSubmitted
                ? 'bg-primary/90 text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasSubmitted ? '제출 완료' : '제출하기'}
          </button>
          <button
            ref={hardButtonRef}
            onClick={() => handleReaction('hard')}
            className={`relative w-[160px] px-4 py-2 rounded-full transition-all flex items-center justify-center space-x-2 ${
              reactionStats.hard > 0
                ? 'bg-red-500/90 text-white'
                : 'bg-white border hover:border-red-400'
            }`}
          >
            <span className="text-2xl ">🤔</span>
            <span>어려워요 ({reactionStats.hard})</span>
          </button>
        </div>
      </div>
    </>
  );
}
