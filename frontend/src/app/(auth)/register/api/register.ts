
import { useMutation } from '@tanstack/react-query';

import { api } from '@/app/libs/axios';
import { RegisterDto } from '../schemas/register';
import { Users } from '@/app/users/types';

export const register = async (data: RegisterDto) =>
  api
    .post<{
      data: Users;
      access_token: string;
    }>('/auth/register', data)
    .then((res) => res.data.data);

export const useRegister = () =>
  useMutation({
    mutationFn: register,
  });
