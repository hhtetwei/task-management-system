
'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'


import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { AuthProvider } from './auth/auth-provider'
import { queryClient } from './libs/react-query'
import { theme } from '../styles/theme'
import { Topbar } from './components/topbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
