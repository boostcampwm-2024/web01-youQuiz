import { toastController } from '@/features/toast/model/toastController';

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
}: GenerateRandomPositionsProps) {
  const toast = toastController();
  const positions: Coordinates[] = [];
  const spacing = 5;

  const isOverlap = (x: number, y: number, existingPositions: Coordinates[]) => {
    return existingPositions.some((pos) => {
      return (
        x < pos.x + buttonSize.width + spacing &&
        x + buttonSize.width + spacing > pos.x &&
        y < pos.y + buttonSize.height + spacing &&
        y + buttonSize.height + spacing > pos.y
      );
    });
  };

  for (let i = 0; i < count; i++) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * (to.x - from.x - buttonSize.width - spacing)) + from.x;
      y = Math.floor(Math.random() * (to.y - from.y - buttonSize.height - spacing)) + from.y;
      attempts++;
    } while (isOverlap(x, y, positions) && attempts < 100);

    if (attempts < 100) {
      positions.push({ x, y });
    } else {
      toast.error('버튼을 배치할 수 없습니다.');
    }
  }

  return positions;
}
