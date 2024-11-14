interface ProgressBarProps {
  /** 전체 시간 설정 */
  time: 5 | 10 | 15 | 20 | 30;
  /** 프로그래스바 타입 */
  type: 'success' | 'warning' | 'error' | 'info';
  /** 프로그래스바 모양 */
  barShape?: 'rounded' | 'square';
  /** 마우스 호버 시 정지 여부 */
  pauseOnHover?: boolean;
  /** 애니메이션 종료 시 콜백 함수 */
  handleAnimationEnd?: () => void;
}

const progressBarColors = {
  success: 'bg-secondary',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const progressBarShapes = {
  rounded: 'rounded-r-base',
  square: 'rounded-none',
};

const progressBarTimes = {
  5: 'animate-progress-5s',
  10: 'animate-progress-10s',
  15: 'animate-progress-15s',
  20: 'animate-progress-20s',
  30: 'animate-progress-30s',
};

export default function ProgressBar({
  time = 5,
  type = 'success',
  barShape = 'rounded',
  pauseOnHover,
  handleAnimationEnd,
}: ProgressBarProps) {
  const progressBarColor = progressBarColors[type];
  const progressBarShape = progressBarShapes[barShape];
  const progressAnimation = progressBarTimes[time];

  return (
    <section className="group" onAnimationEnd={handleAnimationEnd}>
      <div className="h-[6px] w-full bg-transparent">
        <div
          className={`h-[6px] w-full ${progressBarColor} ${progressBarShape} ${progressAnimation} ${pauseOnHover && 'group-hover:[animation-play-state:paused]'}`}
        ></div>
      </div>
    </section>
  );
}
