import MessageIcon from '@/shared/assets/icons/circle-message.svg?react';

interface FloatingQuestionProps {
  delay: number;
  position: string;
}

export default function FloatingQuestion({ delay, position }: FloatingQuestionProps) {
  return (
    <div
      style={{
        animationDelay: `${delay}s`,
      }}
      className={`absolute ${position} text-4xl w-32 h-32 font-bold text-white/30 animate-floating`}
    >
      <div className="relative w-full h-full">
        <MessageIcon stroke="#3b82f6" className="w-full h-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-blue-500 opacity-40">
          ?
        </div>
      </div>
    </div>
  );
}
