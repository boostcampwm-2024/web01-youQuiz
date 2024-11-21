export default function QuizLoading() {
  return (
    <div className="min-h-screen  bg-blue-100 p-4">
      <div className="max-w-2xl mx-auto mt-12 p-16 ">
        <div className="text-center mb-8">
          <span className="text-4xl font-bold">🏆 Leader Board </span>
        </div>

        <div className="flex justify-center items-end gap-20 mb-12 border-2 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-24 w-12 bg-gradient-to-t from-blue-200 to-blue-100 rounded-base" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-32 w-12 bg-gradient-to-t from-blue-300 to-blue-200 rounded-base" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-12 bg-gradient-to-t from-blue-100 to-blue-50 rounded-base" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
          <span className="text-bold-xl">나는 몇 등?</span>
          <span className="font-semibold text-4xl text-blue-600">#10</span>
        </div>
      </div>
    </div>
  );
}
