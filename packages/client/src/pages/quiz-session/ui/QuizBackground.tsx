interface QuizBackgroundProps {
  easyPercentage: number;
}

export default function QuizBackground({ easyPercentage }: QuizBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(to bottom, 
        rgba(16, 185, 129, ${easyPercentage / 200}) 0%,
        rgba(239, 68, 68, ${(100 - easyPercentage) / 200}) 100%)`,
        }}
      />
    </div>
  );
}
