
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-provider';
import { LoadingOverlay } from '@mantine/core';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith('/auth');

  useEffect(() => {
    if (isLoadingUser) return;     
    if (isAuthRoute) return;       
    if (!user) {
      const ret = encodeURIComponent(pathname || '/');
      router.replace(`/auth/login?next=${ret}`);
    }
  }, [user, isLoadingUser, router, pathname, isAuthRoute]);

  if (isAuthRoute) return <>{children}</>;
  if (isLoadingUser) return <LoadingOverlay visible />;
  if (!user) return null;

  return <>{children}</>;
}
