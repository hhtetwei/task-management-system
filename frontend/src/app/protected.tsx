import { ReactNode } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useAuth } from './auth/auth-provider';
import LoginPage from './(auth)/login/page';


export const Protected = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth();
  return (
    <>
      {isLoadingUser ? <LoadingOverlay visible /> : user ? children : <LoginPage />}
    </>
  );
};
