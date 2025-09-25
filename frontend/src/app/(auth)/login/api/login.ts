
import { useMutation } from '@tanstack/react-query';
import { LoginDto } from '../schemas/login';
import { api } from '@/app/libs/axios';
import { Users } from '@/app/users/types';


export const login = async (data: LoginDto) =>
  api
    .post<{
      user: Users;
      access_token: string;
    }>('/auth/login', data)
    .then((res) => {
      console.log('Login API response:', res.data);
      return res.data;
    });


export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
