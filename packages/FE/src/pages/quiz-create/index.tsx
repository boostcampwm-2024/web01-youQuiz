import QuizCreateSection from './ui/QuizCreateSection';
import SideBar from './ui/SideBar';

export default function QuizCreatePage() {
  //TODO: 문제 추가하기 상태 관리
  return (
    <div className="flex w-full">
      <SideBar title="클래스 이름" />
      <QuizCreateSection />
    </div>
  );
}
