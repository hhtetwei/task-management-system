
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/libs/axios';
import { GetUsersDto } from '../types';

export const getUsers = async (queries?: GetUsersDto) =>
  api.get('/users', { params: queries }).then((res) => res.data);

export const useGetUsers = (queries?: GetUsersDto) =>
  useQuery({
    queryFn: () => getUsers(queries),
    queryKey: ['users', queries],
  });
