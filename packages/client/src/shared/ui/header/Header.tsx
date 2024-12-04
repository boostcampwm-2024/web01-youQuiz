import { BackButton } from '../buttons';

interface HeaderProps {
  classTitle: string;
  onClick: () => void;
}

export default function Header({ classTitle, onClick }: HeaderProps) {
  //TODO: 로그인 상태 관리
  return (
    <div className="py-2 bg-white shadow-md">
      <section className="flex justify-between items-center w-dvw mx-auto px-8">
        <div className="flex items-center gap-8">
          <BackButton />
          <h1 className="text-bold-xl cursor-pointer" onClick={onClick}>
            {classTitle}
          </h1>
        </div>
      </section>
    </div>
  );
}
