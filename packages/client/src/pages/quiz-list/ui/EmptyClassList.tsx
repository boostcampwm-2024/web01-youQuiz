import { FileQuestion } from 'lucide-react';

export default function EmptyQuizList() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FileQuestion className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">퀴즈가 없습니다</h3>
      <p className="text-gray-500 text-center mb-6">첫 퀴즈를 만들어보세요.</p>
    </div>
  );
}
