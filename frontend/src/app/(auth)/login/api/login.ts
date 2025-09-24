
import { useMutation } from '@tanstack/react-query';
import { LoginDto } from '../schemas/login';
import { api } from '@/app/libs/axios';
import { User } from '@/app/users/types';

export const login = async (data: LoginDto) =>
  api
    .post<{
      data: User;
      access_token: string;
    }>('/auth/login', data)
    .then((res) => res.data.data);

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
