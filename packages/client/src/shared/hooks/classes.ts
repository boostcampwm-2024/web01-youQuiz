import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClass, deleteClass, getClasses } from '@/shared/api/classes';
import { toastController } from '@/features/toast/model/toastController';

export const useGetClasses = () => {
  const { data } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClasses(),
  });
  return { data };
};

export const useCreateClass = () => {
  const toast = toastController();

  return useMutation({
    mutationKey: ['class'],
    mutationFn: (data: { title: string; description: string }) => createClass(data),
    onSuccess: () => toast.success('클래스가 생성되었습니다.'),
    onError: () => toast.error('클래스 생성에 실패했습니다.'),
  });
};

export const useDeleteClass = () => {
  const toast = toastController();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['class', 'delete'],
    mutationFn: (id: number) => deleteClass(id),
    onSuccess: () => {
      toast.success('클래스가 삭제되었습니다.');
      return queryClient.invalidateQueries({
        queryKey: ['classes'],
      });
    },
    onError: () => toast.error('클래스 삭제에 실패했습니다.'),
  });
};
