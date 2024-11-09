import { Outlet } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';
import SideNav from '@/shared/ui/side-nav/SideNav';

export default function HostLayout() {
  return (
    <div>
      <Header classTitle="클래스 이름" />
      <div className="flex">
        <SideNav />
        <Outlet />
      </div>
    </div>
  );
}
