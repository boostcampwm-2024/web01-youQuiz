interface FloatingSquareProps {
  color: string;
  size: string;
  position: string;
  delay: number;
}

export default function FloatingSquare({ color, size, position, delay }: FloatingSquareProps) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px`, animationDelay: `${delay}s` }}
      className={`absolute ${position} rounded-2xl animate-floating delay-${delay} drop-shadow-sm backdrop-blur bg-gradient-to-br ${color}`}
    />
  );
}
