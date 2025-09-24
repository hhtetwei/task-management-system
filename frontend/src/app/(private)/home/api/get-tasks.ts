
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/libs/axios';
import { GetTasksDto, GetTasksResponse } from '../types';

export const getTasks = async (queries?: GetTasksDto) =>
  api.get<GetTasksResponse>('/tasks', { params: queries }).then((res) => res.data);

export const useGetAllTasks = (queries?: GetTasksDto) =>
  useQuery({
    queryFn: () => getTasks(queries),
    queryKey: ['tasks', queries],
  });