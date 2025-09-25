
import { api } from '@/app/libs/axios';
import { useMutation } from '@tanstack/react-query';

export const deleteTask = async ({ id }: { id: number }) =>
  api.delete(`/tasks/${id}`).then((res) => res.data);

export const useDeleteTask = () => useMutation({ mutationFn: deleteTask });
