export default function QuizLoading() {
  return (
    <div className="min-h-screen  bg-blue-100 p-4">
      <div className="max-w-4xl mx-auto mt-12 ">
        <div className="text-center mb-8">
          <span className="text-bold-xl">Leader Board</span>
        </div>

        <div className="flex justify-center items-end gap-20 mb-12 border-2 border-white rounded-2xl p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-24 w-12 bg-white rounded-base" />
            <span>2</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-32 w-12 bg-white rounded-base" />
            <span>1</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-12 bg-white rounded-base" />
            <span>3</span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
          <span className="text-bold-xl">나는 몇 등?</span>
          <span className="font-semibold text-4xl text-primary">#10</span>
        </div>
      </div>
    </div>
  );
}
