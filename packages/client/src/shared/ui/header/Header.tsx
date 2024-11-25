import { BackButton } from '../buttons';

interface HeaderProps {
  classTitle: string;
}

export default function Header({ classTitle }: HeaderProps) {
  //TODO: 로그인 상태 관리
  return (
    <div className="py-2 bg-white shadow-md">
      <section className="flex justify-between items-center min-w-[980px] mx-auto px-8">
        <div className="flex items-center gap-8">
          <BackButton />
          <h1 className="text-bold-xl">{classTitle}</h1>
        </div>
      </section>
    </div>
  );
}
