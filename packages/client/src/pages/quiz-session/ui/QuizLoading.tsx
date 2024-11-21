const QuizLoading = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="relative p-12 rounded-3xl bg-white/30 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-white/20">
        <div className="relative flex flex-col items-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-blue-500 border-l-blue-500 animate-spin" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <div className="absolute w-2 h-2 rounded-full bg-blue-400 top-0" />
              <div className="absolute w-2 h-2 rounded-full bg-indigo-400 right-0" />
              <div className="absolute w-2 h-2 rounded-full bg-violet-400 bottom-0" />
              <div className="absolute w-2 h-2 rounded-full bg-purple-400 left-0" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-xl font-medium text-slate-700 tracking-wide">
              다음 퀴즈로 이동 중 입니다.
            </h2>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500 font-medium animate-pulse">
            잠시만 기다려주세요...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizLoading;
