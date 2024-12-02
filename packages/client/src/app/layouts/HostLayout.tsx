import { Outlet, useNavigate } from 'react-router-dom';

import Header from '@/shared/ui/header/Header';

export default function HostLayout() {
  const navigate = useNavigate();

  return (
    <div>
      <Header classTitle="YOU QUIZ" onClick={() => navigate('/')} />
      <div className="flex">
        <Outlet />
      </div>
    </div>
  );
}
