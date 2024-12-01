import { useEffect } from 'react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';

import { getCookie } from '@/shared/utils/cookie';

export default function PreventGuestRouter() {
  const navigate = useNavigate();
  const { pinCode } = useParams();

  useEffect(() => {
    if (!pinCode) {
      navigate('/');
    }
    const sid = getCookie('sid');
    if (!sid && pinCode) {
      navigate(`/nickname/${pinCode}`);
    }
  }, [navigate, pinCode]);

  return <Outlet />;
}
