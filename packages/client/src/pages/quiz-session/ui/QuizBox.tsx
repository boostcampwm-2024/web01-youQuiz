import { useState, useRef, useEffect, useCallback } from 'react';

import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';
import { useParams } from 'react-router-dom';
import AfterQuizSubmit from './AfterQuizSubmit';
import QuizBackground from './QuizBackground';
import {
  TimerTickResponse,
  ParticipantStatisticsResponse,
} from '@youquiz/shared/interfaces/response';
import { INITIAL_PARTICIPANT_STATISTICS, INITIAL_EMOJI } from '@/shared/constants/initialState';
interface QuizBoxProps {
  quiz: QuizData;
  tick: TimerTickResponse;
}

export default function QuizBox({ quiz, tick }: QuizBoxProps) {
  const { pinCode } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [reactionStats, setReactionStats] = useState(INITIAL_EMOJI);
  const [participantStatistics, setParticipantStatistics] = useState<ParticipantStatisticsResponse>(
    INITIAL_PARTICIPANT_STATISTICS,
  );
  const easyButtonRef = useRef<HTMLButtonElement>(null);
  const hardButtonRef = useRef<HTMLButtonElement>(null);
  const socket = getQuizSocket();

  const totalReactions = reactionStats.easy + reactionStats.hard;
  const easyPercentage = totalReactions ? (reactionStats.easy / totalReactions) * 100 : 50;

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswer((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      }
      return [...prev, idx];
    });
  };

  const handleSubmit = () => {
    socket.emit('submit answer', {
      selectedAnswer: selectedAnswer,
      sid: getCookie('sid'),
      pinCode: pinCode,
      submitTime: tick.elaspedTime,
    });
    setHasSubmitted(true);
  };

  const handleReaction = (reaction: 'easy' | 'hard') => {
    handleFloatUp(reaction);

    socket.emit('emoji', { pinCode: pinCode, currentOrder: quiz.position, emoji: reaction });
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

  const handleReactionUpdate = useCallback((response: { easy: number; hard: number }) => {
    setReactionStats({
      easy: response.easy,
      hard: response.hard,
    });
  }, []);

  const handleParticipantStatistics = (response: ParticipantStatisticsResponse) => {
    setParticipantStatistics(response);
  };

  useEffect(() => {
    socket.on('emoji', handleReactionUpdate);
    socket.on('participant statistics', handleParticipantStatistics);

    return () => {
      socket.off('emoji', handleReactionUpdate);
      socket.off('participant statistics', handleParticipantStatistics);
    };
  }, []);

  return (
    <>
      <QuizBackground easyPercentage={easyPercentage} />
      <div className="relative z-10 p-6 max-w-4xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Question {quiz.position}/10</span>
            <span className="text-sm text-gray-500">
              난이도
              <div className="flex items-center">
                <div className="w-12 h-2 bg-gradient-to-t from-blue-200 to-blue-100 rounded-base" />
                <div className="w-12 h-2 bg-gradient-to-t from-blue-200 to-blue-100 rounded-base" />
              </div>
            </span>
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
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full p-4 text-left rounded-xl border transition-all ${
                  selectedAnswer.includes(idx)
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
      {hasSubmitted && <AfterQuizSubmit participantStatistics={participantStatistics} />}
    </>
  );
}
