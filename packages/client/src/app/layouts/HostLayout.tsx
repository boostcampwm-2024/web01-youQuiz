import { Outlet } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';

export default function HostLayout() {
  return (
    <div>
      <Header classTitle="클래스 이름" />
      <div className="flex">
        <Outlet />
      </div>
    </div>
  );
}
