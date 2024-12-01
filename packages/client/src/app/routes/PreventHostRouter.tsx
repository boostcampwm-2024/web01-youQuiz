import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { getCookie } from '@/shared/utils/cookie';
import { apiClient } from '@/shared/api';

export default function PreventHostRouter() {
  const navigate = useNavigate();
  const { pinCode } = useParams();

  useEffect(() => {
    const sid = getCookie('sid');
    const fetchUserType = async () => {
      const response = await apiClient.get(`/games/${pinCode}/sid/${sid}`);
      return response.type;
    };
    if (!pinCode || !sid) {
      navigate('/');
    }
    fetchUserType().then((userType) => {
      if (userType !== 'master') {
        navigate(`/`);
      }
    });
  }, [navigate, pinCode]);

  return <Outlet />;
}
