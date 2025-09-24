
'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Topbar } from '../components/topbar';
import Protected from '../protected';


export default function AppAreaLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Protected>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: opened ? 300 : 60,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Topbar toggle={toggle} />
        </AppShell.Header>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </Protected>
  );
}
