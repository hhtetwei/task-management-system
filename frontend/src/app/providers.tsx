
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { AuthProvider } from './auth/auth-provider'
import { queryClient } from './libs/react-query'
import { theme } from '../styles/theme'
import { Notifications } from '@mantine/notifications'


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
      <Notifications position="top-right" />
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
