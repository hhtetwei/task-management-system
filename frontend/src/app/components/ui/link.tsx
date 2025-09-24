import { Anchor as MantineAnchor } from '@mantine/core';
import clsx from 'clsx';
import type { ComponentProps } from 'react';


type Props = ComponentProps<'a'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: any;
  color?: 'primary' | 'error' | 'secondary';
  to?: string;
};

export const Link = ({ className, color = 'primary', component, ...props }: Props) => {
  const Component = component || 'a';
  // maps to colors in tailwind.config.js
  const resolvedColorMapping: Record<typeof color, string> = {
    primary: 'text-primary-primary',
    secondary: 'text-secondary-primary',
    error: 'text-error-500',
  };

  const resolvedColor = resolvedColorMapping[color];

  return (
    <MantineAnchor {...props} component={Component} className={clsx(resolvedColor, className)} />
  );
};
