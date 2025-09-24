
import { useMutation } from '@tanstack/react-query';
import { CreateTaskDto } from '../schemas/create-task';
import { api } from '@/app/libs/axios';

export const updateTask = async ({ id, data }: { id: number; data: CreateTaskDto }) =>
  api.patch(`/tasks/${id}`, data).then((res) => res.data);

export const useUpdateTask = () => useMutation({ mutationFn: updateTask });
