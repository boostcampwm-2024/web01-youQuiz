import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api';

interface UserTypePayload {
  pinCode: string;
  sid: string;
}

type UserTypeResponse = 'master' | 'participant';

const getUserType = async ({ pinCode, sid }: UserTypePayload): Promise<UserTypeResponse> => {
  return await apiClient.get(`/games/${pinCode}/sid/${sid}`);
};

export const useGetUserType = ({ pinCode, sid }: UserTypePayload) => {
  const { data } = useQuery({
    queryKey: ['userType', pinCode, sid],
    queryFn: () => getUserType({ pinCode, sid }),
  });
  return { data };
};
