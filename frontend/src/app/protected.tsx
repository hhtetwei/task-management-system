'use client';

import { useAuth } from '@/app/auth/auth-provider';
import { LoadingOverlay } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ['/login', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    console.log('Protected component - Auth state:', { 
      user, 
      isLoadingUser, 
      isPublicRoute, 
      pathname 
    });

    if (!isLoadingUser) {

      if (!user && !isPublicRoute) {
        console.log('Redirecting to login - user not authenticated');
        router.replace('/login');
      }
      
      if (user && isPublicRoute) {
        console.log('Redirecting to home - user authenticated on public route');
        router.replace('/home');
      }
    }
  }, [user, isLoadingUser, isPublicRoute, pathname, router]);

  if (isLoadingUser) {
    return <LoadingOverlay visible />;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return <LoadingOverlay visible />;
  }

  return <>{children}</>;
}