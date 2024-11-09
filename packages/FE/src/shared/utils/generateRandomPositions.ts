interface Coordinates {
  x: number;
  y: number;
}

interface ButtonSize {
  width: number;
  height: number;
}

interface GenerateRandomPositionsProps {
  from: Coordinates;
  to: Coordinates;
  count: number;
  buttonSize: ButtonSize;
  spacing?: number;
}

export function generateRandomPositions({
  from,
  to,
  count,
  buttonSize,
  spacing = 10,
}: GenerateRandomPositionsProps) {
  const positions: Coordinates[] = [];
  const { x: fromX, y: fromY } = from;
  const { x: toX, y: toY } = to;
  const { width: buttonWidth, height: buttonHeight } = buttonSize;

  const isOverlap = (x: number, y: number) => {
    return positions.some((position) => {
      return (
        x < position.x + buttonWidth + spacing &&
        x + buttonWidth + spacing > position.x &&
        y < position.y + buttonHeight + spacing &&
        y + buttonHeight + spacing > position.y
      );
    });
  };

  let attempts = 0;
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let x, y;

    do {
      x = Math.floor(Math.random() * (toX - fromX - buttonWidth - spacing) + fromX);
      y = Math.floor(Math.random() * (toY - fromY - buttonHeight - spacing) + fromY);
      attempts++;

      if (attempts >= maxAttempts) {
        console.warn('최대 시도 횟수에 도달했습니다. 더 이상 충돌 없는 위치를 찾을 수 없습니다.');
        break;
      }
    } while (isOverlap(x, y));

    positions.push({ x, y });
  }

  return positions;
}
