
import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/libs/axios';
import { User } from '@/app/users/types';
import { RegisterDto } from '../schemas/register';

export const register = async (data: RegisterDto) =>
  api
    .post<{
      data: User;
      access_token: string;
    }>('/auth/register', data)
    .then((res) => res.data.data);

export const useRegister = () =>
  useMutation({
    mutationFn: register,
  });
