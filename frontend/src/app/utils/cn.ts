import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...s: ClassValue[]) => {
  return twMerge(clsx(s));
};
