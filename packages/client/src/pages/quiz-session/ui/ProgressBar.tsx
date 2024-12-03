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
  currentTime?: number;
}

const progressBarColors = {
  success: 'bg-secondary',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  gradient: 'bg-gradient-to-r from-red-500 to-orange-500',
};

const progressBarShapes = {
  rounded: 'rounded-r-base',
  square: 'rounded-none',
};

const ProgressBar = ({
  time = 5,
  type = 'success',
  barShape = 'rounded',
  pauseOnHover,
  handleAnimationEnd,
  currentTime = 0,
}: ProgressBarProps) => {
  const progressBarColor = progressBarColors[type];
  const progressBarShape = progressBarShapes[barShape];

  // 현재 시간에 따른 진행률 계산
  const progress = Math.min(Math.max((currentTime / time) * 100, 0), 100);
  // 남은 시간 비율 계산
  const remainingTimeRatio = 1 - currentTime / time;
  // 애니메이션 지속 시간 계산 (초 단위)
  const animationDuration = time * remainingTimeRatio;

  return (
    <section className="group" onAnimationEnd={handleAnimationEnd}>
      <div className="h-[6px] w-full bg-transparent">
        <div
          className={`h-[6px] ${progressBarColor} ${progressBarShape} ${
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          }`}
          style={{
            width: `${progress}%`,
            animation: `progress ${animationDuration}s linear forwards`,
          }}
        />
      </div>
    </section>
  );
};

export default ProgressBar;
