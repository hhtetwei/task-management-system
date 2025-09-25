import type { Metadata } from 'next'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css'
import { Providers } from '@/app/providers';
import Protected from '@/app/protected';

export const metadata: Metadata = {
  title: 'Task App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Protected>{children}</Protected>
        </Providers>
      </body>
    </html>
  )
}