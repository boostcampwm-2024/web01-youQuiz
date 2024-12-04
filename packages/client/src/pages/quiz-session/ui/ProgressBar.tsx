import { useEffect, useRef } from 'react';

interface ProgressBarProps {
  /** 전체 시간 설정 */
  time: number;
  /** 프로그래스바 타입 */
  type: 'success' | 'warning' | 'error' | 'info' | 'gradient';
  /** 프로그래스바 모양 */
  barShape?: 'rounded' | 'square';
  /** 마우스 호버 시 정지 여부 */
  pauseOnHover?: boolean;
  /** 애니메이션 종료 시 콜백 함수 */
  handleAnimationEnd?: () => void;
  /** 현재 진행 시간 */
  remainingTime: number;
}

const progressBarColors = {
  success: 'bg-secondary',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
};

const progressBarShapes = {
  rounded: 'rounded-base',
  square: 'rounded-none',
};

const ProgressBar = ({
  time,
  type = 'success',
  barShape = 'rounded',
  pauseOnHover,
  handleAnimationEnd,
  remainingTime,
}: ProgressBarProps) => {
  const progressBarColor = progressBarColors[type];
  const progressBarShape = progressBarShapes[barShape];
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + remainingTime * 1000;

    const updateWidth = () => {
      const now = Date.now();
      const remaining = Math.max(endTime - now, 0);
      const progress = (remaining / (time * 1000)) * 100;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }

      if (remaining > 0) {
        requestAnimationFrame(updateWidth);
      }
    };

    updateWidth();
  }, [remainingTime, time]);

  return (
    <section className="group" onAnimationEnd={handleAnimationEnd}>
      <div className="h-[6px] w-full bg-transparent">
        <div
          className={`h-[6px] ${progressBarColor} ${progressBarShape} ${
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          }`}
          ref={progressBarRef}
        />
      </div>
    </section>
  );
};

export default ProgressBar;
