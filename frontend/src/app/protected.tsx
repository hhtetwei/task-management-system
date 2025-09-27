
'use client'
import { ReactNode, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { useAuth } from './auth/auth-provider';
import { useRouter } from 'next/navigation';

export const Protected = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser && !user) router.replace('/login');
  }, [isLoadingUser, user, router]);

  if (isLoadingUser) return <LoadingOverlay visible />;
  if (!user) return null;

  return <>{children}</>;
};
