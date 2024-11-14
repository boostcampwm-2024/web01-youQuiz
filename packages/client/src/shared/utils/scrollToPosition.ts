export const scrollToPosition = () => {
  const scrollTo = (targetY: number, duration: number = 500) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    // Easing 함수 - 참고 https://gist.github.com/gre/1650294
    const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animateScroll = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const timeElapsed = timestamp - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = easeInOutQuad(progress);

      window.scrollTo(0, startY + diff * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return { scrollTo };
};
