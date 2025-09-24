/* eslint-disable react/display-name */
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react';
import { ButtonProps, Button as MantineButton } from '@mantine/core';
import clsx from 'clsx';

type IconProps =
  | {
      leftIcon: ReactNode;
      rightIcon?: never;
    }
  | {
      leftIcon?: never;
      rightIcon: ReactNode;
    }
  | {
      leftIcon?: undefined;
      rightIcon?: undefined;
    };

type Props = {
  loading?: boolean;
  size?: ButtonProps['size'];
  color?: 'primary' | 'error';
  variant?: ButtonProps['variant'];
  disabled?: boolean;
} & IconProps &
  ComponentPropsWithoutRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      size,
      color = 'primary',
      loading = false,
      variant = 'filled',
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      ...rest
    },
    ref
  ) => {
    const colorMapping: Record<typeof color, string> = {
      primary: 'primary',
      error: 'error.5',
    };

    return (
      <MantineButton
        ref={ref}
        size={size}
        color={colorMapping[color]}
        loading={loading}
        leftSection={leftIcon}
        rightSection={rightIcon}
        variant={variant}
        disabled={disabled}
        radius="md"
        className={clsx(['text-sm', size === 'md' ? 'min-w-[120px]' : '', className])}
        {...rest}
      >
        {children}
      </MantineButton>
    );
  }
);
