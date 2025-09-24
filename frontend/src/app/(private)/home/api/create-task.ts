
import { useMutation } from '@tanstack/react-query';
import { Tasks } from '../types';
import { api } from '@/app/libs/axios';

export const createTask = async (data: Tasks) =>
  api.post('/tasks', data).then((res) => res.data);

export const useCreateTask = () => useMutation({ mutationFn: createTask });
