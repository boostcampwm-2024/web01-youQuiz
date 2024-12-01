export default function ConfettiBackground() {
  return (
    <div className="absolute w-dvw ">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="absolute animate-[confetti_linear_infinite] w-2 h-2"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#FFD700', '#FF3E4D', '#4CAF50', '#2196F3'][
              Math.floor(Math.random() * 4)
            ],
          }}
        />
      ))}
    </div>
  );
}
