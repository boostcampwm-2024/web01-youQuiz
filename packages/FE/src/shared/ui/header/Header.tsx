import { CustomButton, BackButton } from '../buttons';
import LogoutIcon from '../../assets/icons/logout.svg?react';
import ToolIcon from '../../assets/icons/tool.svg?react';

interface HeaderProps {
  className: string;
}

export default function Header({ className }: HeaderProps) {
  //TODO: 로그인 상태 관리
  return (
    <div className="border-b-2 py-4">
      <section className="flex justify-between items-center min-w-[980px] mx-auto px-8">
        <div className="flex items-center gap-8">
          <BackButton />
          <h1 className="text-bold-xl">{className}</h1>
        </div>
        <div className="flex gap-4">
          <CustomButton label="LOGOUT" type="outline" Icon={LogoutIcon} />
          <CustomButton label="SETTINGS" type="outline" Icon={ToolIcon} />
        </div>
      </section>
    </div>
  );
}
