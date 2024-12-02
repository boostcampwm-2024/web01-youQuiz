import { Outlet, useNavigate } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';

export default function GuestLayout() {
  const navigate = useNavigate();
  return (
    <>
      <Header classTitle="YOU QUIZ" onClick={() => navigate('/')} />
      <Outlet />
    </>
  );
}
