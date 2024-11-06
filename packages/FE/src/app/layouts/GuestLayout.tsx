import { Outlet } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';

export default function GuestLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
