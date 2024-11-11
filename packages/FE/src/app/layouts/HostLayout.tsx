import { Outlet } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';
import SideNav from '@/shared/ui/side-nav/SideNav';
import SideBar from '@/shared/ui/side-bar/SideBar';

export default function HostLayout() {
  return (
    <div>
      <Header classTitle="클래스 이름" />
      <div className="flex">
        <SideNav />
        <SideBar title="클래스 이름" />
        <Outlet />
      </div>
    </div>
  );
}
